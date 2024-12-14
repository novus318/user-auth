import React from 'react'

const SignupTab = () => {
  return (
    <div className="p-6 rounded-xl bg-slate-50">
    <h2 className="text-2xl font-semibold mb-4">Signup</h2>
    <input
      type="text"
      placeholder="Name"
      className="w-full p-2 rounded-md mb-3 text-neutral-950 border"
    />
    <input
      type="email"
      placeholder="Email"
      className="w-full p-2 rounded-md mb-3 text-neutral-950 border"
    />
    <input
      type="password"
      placeholder="Password"
      className="w-full p-2 rounded-md mb-3 text-neutral-950 border"
    />
    <button className="w-full py-3 bg-black text-white rounded-md">Submit</button>
  </div>
  )
}

export default SignupTab