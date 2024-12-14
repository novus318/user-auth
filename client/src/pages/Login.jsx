import React, { useState } from 'react'
import LoginTab from '../components/LoginTab';
import SignupTab from '../components/SignupTab';

const Login = () => {
    const [activeTab, setActiveTab] = useState('login');
  return (
    <div className="w-full flex min-h-screen ">
    <div className="w-[400px] flex flex-col items-center justify-center mx-auto bg-white p-8">
      <h1 className="font-title text-4xl text-neutral-950 mb-6">Welcome</h1>
      <div className="w-full flex justify-between mb-6">
        <button
          className={`w-[48%] py-2 rounded-md transition-all duration-300 ${
            activeTab === 'login'
              ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white'
              : 'bg-neutral-100 text-neutral-950'
          }`}
          onClick={() => setActiveTab('login')}
        >
          Login
        </button>
        <button
          className={`w-[48%] py-2 rounded-md transition-all duration-300 ${
            activeTab === 'signup'
              ? 'bg-gradient-to-r from-pink-400 to-red-500 text-white'
              : 'bg-neutral-100 text-neutral-950'
          }`}
          onClick={() => setActiveTab('signup')}
        >
          Signup
        </button>
      </div>
      <div className="w-full">
        {activeTab === 'login' ? <LoginTab /> : <SignupTab />}
      </div>
    </div>
  </div>
  )
}

export default Login