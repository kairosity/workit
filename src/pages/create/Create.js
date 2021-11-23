import { useState, useEffect } from 'react'
import Select from 'react-select'
import { useCollection } from '../../hooks/useCollection'
import { timestamp } from '../../firebase/config' 
import { useAuthContext } from '../../hooks/useAuthContext'
import { projectFirestore } from '../../firebase/config'
import { useFirestore } from '../../hooks/useFirestore'

// styles
import './Create.css'
import { Navigate, useNavigate } from 'react-router'

const categories = [
    {value: 'development', label: 'Development'},
    {value: 'design', label: 'Design'},
    {value: 'sales', label: 'Sales'},
    {value: 'marketing', label: 'Marketing'},
]

export default function Create() {

    const { documents } = useCollection('users')
    const [users, setUsers] = useState([])
    const { user } = useAuthContext() 

    const [name, setName] = useState('')
    const [details, setDetails] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [category, setCategory] = useState('')
    const [assignedUsers, setAssignedUsers] = useState([])
    const [formError, setFormError] = useState(null)

    let navigate = useNavigate()

    const { addDocument, response } = useFirestore('projects')

    useEffect(() => {
        if(documents){
            const options = documents.map((user) => {
                return { value: user, label: user.displayName }
            })
            setUsers(options)
        }
    }, [documents])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError(null)

        if(!category){
            setFormError('You need to select a category')
            return
        }
        if(assignedUsers.length < 1){
            setFormError('You need to assign at least one user to this project.')
            return
        }

        const createdBy = {
            displayName: user.displayName,
            uid: user.uid, 
            photoURL: user.photoURL,
        }

        const assignedUsersList = assignedUsers.map((user) => {
            return {
                displayName: user.value.displayName,
                photoURL: user.value.photoURL,
                uid: user.value.id,
            }
        })
        
        const project = {
            name: name,
            details: details,
            category: category.value,
            dueDate: timestamp.fromDate(new Date(dueDate)),
            comments: [],
            createdBy: createdBy,
            assignedUsersList: assignedUsersList
        }

        await addDocument(project)
        if(!response.error){
            navigate('/')
        }
    }

    return (
        <div className='create-form'>
            <h2 className='page-title'>Create a new project</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Project name:</span>
                    <input
                        required
                        type='text'
                        onChange={(e) => {setName(e.target.value)}}
                        value={name}
                    />
                </label>
                <label>
                    <span>Project details:</span>
                    <textarea
                        required
                        type='text'
                        onChange={(e) => {setDetails(e.target.value)}}
                        value={details}
                    ></textarea>
                </label>
                <label>
                    <span>Set due date:</span>
                    <input
                        required
                        type='date'
                        onChange={(e) => {setDueDate(e.target.value)}}
                        value={dueDate}
                    />
                </label>
                <label>
                    <span>Project category:</span>
                    <Select
                        options={categories}
                        onChange={(option) => {setCategory(option)}}
                    />
                </label>
                <label>
                    <span>Assign to:</span>
                    <Select
                        options={users}
                        onChange={(option) => {setAssignedUsers(option)}}
                        isMulti
                    />
                </label>
                {formError && <p className="error">{formError}</p>}
                <button className='btn'>Add Project</button>
            </form>
        </div>
    )
}