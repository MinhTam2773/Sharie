import React, { useState } from 'react'

const Toast = () => {
    const [content, setContent] = useState('Uploading')
  return (
    <div
        className='flex gap-3 fixed left-5 z-50 bottom-10 bg-gray-700 px-3 py-3 rounded-xl'
    >
        <p className=''>{content}</p>
        <div className="w-5 h-5 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

export default Toast