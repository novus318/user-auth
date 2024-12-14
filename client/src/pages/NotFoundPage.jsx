import React from 'react'

const NotFoundPage = () => {
  return (
  <div className='flex w-full min-h-screen'>
      <div className="w-[400px] bg-white min-h-[600px] flex flex-col items-center justify-center mx-auto">
    <div className="flex flex-col items-center gap-4">
      <i className="fa-brands fa-apple text-6xl text-neutral-950"></i>
      <h1 className="font-title text-3xl text-neutral-950">
        Page Not Found
      </h1>
      <p className="text-neutral-500 text-center">
        The page you are looking for couldn’t be found. Try searching again
        or go back to the homepage.
      </p>
      <button className="h-[40px] px-6 bg-gradient-to-t from-red-600 to-yellow-600 text-white  rounded-full hover:bg-primary-600"
      onClick={()=>{
        window.location.href = '/'
      }}>
        Go to Homepage
      </button>
    </div>
  </div>
  </div>
  )
}

export default NotFoundPage