import { useState, useEffect } from 'react'
import { projectAuth, projectStorage, projectFirestore } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()

  const signup = async (email, password, displayName, thumbnail) => {
    setError(null)
    setIsPending(true)
  
    try {
      // signup
      const res = await projectAuth.createUserWithEmailAndPassword(email, password)

      if (!res) {
        throw new Error('Could not complete signup')
      }

      // upload user thumbnail
      const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`

      // these two bits of code need to be completed before moving on
      // hence await

      // This accesses the ref method on projectStorage that accepts a 
      // path which is a reference to where we want to upload the image. 
      // And then we use put() method which puts the file into that place.
      // This returns a response. 
      const img = await projectStorage.ref(uploadPath).put(thumbnail)

      // There are different props on that img obj. We use a ref method to get 
      // a reference to that img obj and then getDownloadURL to get the path to the url.
      const imgUrl = await img.ref.getDownloadURL()

      console.log(imgUrl)

      // add display name to user
      await res.user.updateProfile({ 
        displayName: displayName,
        photoUrl: imgUrl
      })

      // create a user document
      // creating a new doc inside the users collection for every user that signs up.
      // id of that doc is the user id to connect the user to the doc
      await projectFirestore.collection('users').doc(res.user.uid).set({
        online: true,
        displayName: displayName,
        photoUrl: imgUrl
      })

      // dispatch login action
      dispatch({ type: 'LOGIN', payload: res.user })

      if (!isCancelled) {
        setIsPending(false)
        setError(null)
      }
    } 
    catch(err) {
      if (!isCancelled) {
        setError(err.message)
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { signup, error, isPending }
}