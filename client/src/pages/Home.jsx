import React, { useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  useEffect(() => {
  const fetch = async()=>{
    const response = await axios.get('/api')
    if(response.status === 200){
      console.log(response.data)
    }
  }
  fetch();
  }, []);
  return (
    <div className="w-full min-h-screen flex items-center justify-center ">
      <div className="w-[800px] min-h-[600px] bg-white flex flex-col">
        <div className="w-full flex justify-end py-4 px-6">
          <button className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md shadow-md hover:opacity-90 transition-all">
            Logout
          </button>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <h1 className="text-5xl font-title text-neutral-950 mb-4">Welcome Back!</h1>
          <p className="text-lg text-neutral-700">We’re delighted to have you here.</p>
          <div className="mt-8 bg-gradient-to-br from-gray-200 to-gray-100 px-6 py-4 rounded-md w-[400px] text-left shadow-lg">
            <p className="text-neutral-950 text-lg font-medium">Name: John Doe</p>
            <p className="text-neutral-950 text-lg font-medium">Email: john.doe@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
