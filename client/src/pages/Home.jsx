import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Loader2} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); 
  const [user, setUser] = useState({});
  useEffect(() => {
    const fetch = async () => {
      const token = await localStorage.getItem('token'); 

      if (!token) {
        navigate('/login')
        return;
      }

      try {
        // Make the request to verify the token
        const response = await axios.post('/api/user/verify', {token:token});

        // Handle the response
        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (err) {
       if (err.response?.data?.detail === "Token has expired") {
        await localStorage.removeItem('token');
        navigate('/login')
       }
       navigate('/login')
      } finally {
        setLoading(false); 
      }
    };

    fetch();
  }, [navigate]);

const handleLogout = async() =>{
  await localStorage.removeItem('token');
  navigate('/login')
}
  if (loading) {
    return <div className='flex min-h-screen items-center justify-center'>
      <Loader2 className='animate-spin'/>
    </div>;
  }
  
  return (
    <div className="w-full min-h-screen flex items-center justify-center ">
      <div className="w-[800px] min-h-[600px] bg-white flex flex-col">
        <div className="w-full flex justify-end py-4 px-6">
          <button
          onClick={handleLogout}
           className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md shadow-md hover:opacity-90 transition-all">
            Logout
          </button>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <h1 className="text-5xl font-title text-neutral-950 mb-4">Welcome Back!</h1>
          <p className="text-lg text-neutral-700">We’re delighted to have you here.</p>
          <div className="mt-8 bg-gradient-to-br from-gray-200 to-gray-100 px-6 py-4 rounded-md w-[400px] text-left shadow-lg">
            <p className="text-neutral-950 text-lg font-medium">Name: {user?.name}</p>
            <p className="text-neutral-950 text-lg font-medium">Email: {user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
