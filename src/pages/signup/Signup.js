import { useState } from 'react'
import { useSignup } from '../../hooks/useSignup'

// styles
import './Signup.css'

export default function Signup() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [thumbnail, setThumbnail] = useState(null)
    const [thumbnailError, setThumbnailError] = useState(null)
    const {signup, isPending, error} = useSignup()

    const handleSubmit = (e) => {
        e.preventDefault()
        signup(email, password, displayName, thumbnail)
    }

    // func to handle avatar image uploads
    const handleFileChange = (e) => {
        setThumbnail(null)
        let selected = e.target.files[0]
        console.log(selected)

        // ensure that a file is selected
        if(!selected){
            setThumbnailError('Please select a file.')
            return
        }

        // ensure that the file is an image
        if(!selected.type.includes('image')){
            setThumbnailError('Selected file must be an image.')
            return
        }
        
        // ensure image is smaller than 100kb
        if(selected.size > 100000){
            setThumbnailError('Selected image filesize must be less than 100kb')
            return
        }

        setThumbnailError(null)
        setThumbnail(selected)

    }

    return (
        <form 
            className='auth-form'
            onSubmit={handleSubmit}
        >
            <h2>Sign up</h2>
            <label>
                <span>email:</span>
                <input
                    type="email"
                    required
                    onChange={(e) => {setEmail(e.target.value)}}
                    value={email}
                />
            </label>
            <label>
                <span>password:</span>
                <input
                    type="password"
                    required
                    onChange={(e) => {setPassword(e.target.value)}}
                    value={password}
                />
            </label>
            <label>
                <span>display name:</span>
                <input
                    type="text"
                    required
                    onChange={(e) => {setDisplayName(e.target.value)}}
                    value={displayName}
                />
            </label>
            <label>
                <span>profile thumbnail:</span>
                <input
                    type="file"
                    required
                    onChange={handleFileChange}
                />
                {thumbnailError && <div className="error">{thumbnailError}</div>}
            </label>
            {!isPending && <button className='btn'>Sign Up</button>}
            {isPending && <button className='btn' disabled>Loading...</button>}
            {error && <div className="error">{error}</div>}
        </form>
    )
}