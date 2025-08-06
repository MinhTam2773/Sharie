import React from 'react'

const Comment = ({ comment }) => {

    return (
        <div className='flex '>
            <img src={comment.commentor.avatar} className='rounded-full h-12 w-12' />
            <div>
                <span>{comment.commentor.username}</span>
                <div className='bg-gray-500'>
                    <p>{comment.text}</p>
                </div>
            </div>
        </div>
    )
}

export default Comment