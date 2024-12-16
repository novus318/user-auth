import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Loader2, Edit2, Check, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [newName, setNewName] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [nameUpdateStatus, setNameUpdateStatus] = useState('')

  useEffect(() => {
    const fetch = async () => {
      const token = await localStorage.getItem('token')

      if (!token) {
        navigate('/login')
        return
      }

      try {
        const response = await axios.post('/api/user/verify', { token: token })

        if (response.data.success) {
          setUser(response.data.user)
          setNewName(response.data.user.name)
        }
      } catch (err) {
        if (err.response?.data?.detail === "Token has expired") {
          await localStorage.removeItem('token')
        }
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [navigate])

  const handleLogout = async () => {
    await localStorage.removeItem('token')
    navigate('/login')
  }

  const handleNameChange = async () => {
    if (!newName.trim() || newName === user?.name) {
      setIsEditing(false); 
      return;
    }
  
    try {
      const response = await axios.put(
        `/api/user/update-user/${user?.id}`, 
        { name: newName } 
      );
  
      if (response.data.success) {
        setUser((prevUser) => prevUser ? { ...prevUser, name: newName } : null);
      }
    } catch (err) {
      setNameUpdateStatus('An error occurred while updating name');
    } finally {
      setIsEditing(false);  
    }
  };
  

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loader2 className='animate-spin' />
      </div>
    )
  }
  
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="w-full flex justify-end py-4 px-6">
        <button
        onClick={handleLogout}
         className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md shadow-md hover:opacity-90 transition-all">
          Logout
        </button>
        </div>
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Welcome Back!</h1>
          <p className="text-lg text-gray-600 mb-8">We're delighted to have you here.</p>
          <div className="w-full max-w-md bg-gray-50 px-6 py-8 rounded-md text-left shadow-md">
            <div className="flex items-center mb-4">
              <p className="text-gray-700 text-lg font-medium">Name:</p>
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-grow"
                  />
                  <button onClick={handleNameChange} size="icon" variant="ghost">
                    <Check className="h-4 w-4" />
                  </button>
                  <button onClick={() => setIsEditing(false)} size="icon" variant="ghost">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900 text-lg font-semibold">{user?.name}</span>
                  <button onClick={() => setIsEditing(true)} size="icon" variant="ghost">
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-gray-700 text-lg font-medium">
              Email: <span className="text-gray-900 font-semibold">{user?.email}</span>
            </p>
            {nameUpdateStatus && (
              <p className={`mt-4 text-sm ${nameUpdateStatus.includes('error') ? 'text-red-500' : 'text-green-500'}`}>
                {nameUpdateStatus}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

