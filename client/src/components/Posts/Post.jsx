import React, { useState } from 'react'
import { FaComment, FaRegHeart, FaShare } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useAuthStore } from '../../store/authStore'
import { usePostStore } from '../../store/postStore'
import CommentInput from './CommentInput';
import { MdCancel } from "react-icons/md";
import SelectedPost from './SelectedPost';

const Post = ({ post }) => {
  const { user } = useAuthStore()
  const { likePost, unlikePost } = usePostStore()

  const [likeCount, setLikeCount] = useState(post.likeCount)
  const [likes, setLikes] = useState(post.likes)
  const [hasLiked, setHasLiked] = useState(post.likes.includes(user._id))

  const [isOpen, setIsOpen] = useState(false)

  const handleLikeButton = async () => {
    if (!hasLiked) {
      await likePost(post._id)
      setLikeCount(prev => prev += 1)
      setLikes(prev => [...prev, user._id])
      setHasLiked(true)
    } else {
      await unlikePost(post._id)
      setLikeCount(prev => prev -= 1)
      setLikes(prev => prev.filter(id => id !== user._id))
      setHasLiked(false)
    }
  }

  const handleGettingComments = async () => {
    setIsOpen(true)
  }


  return (
    <div className='w-5/6 mx-auto bg-gray-800 flex flex-col rounded-2xl'>
      <div className='flex gap-3 p-3'>
        <img src={post.author.avatar} alt={`${post.author.username}'s avatar`} className='h-12 w-12 rounded-full' />
        <p className='font-semibold'>{post.author.username}</p>
      </div>
      {post.caption && (
        <div className='px-3 text-lg'>
          <p>{post.caption}</p>
        </div>)}
      {post.mediaType && (
        <>
          {post.mediaType === 'image'
            ? <img src={post.mediaUrl} />
            : <video src={post.mediaUrl} />
          }</>
      )}

      <div className='flex gap-7 content-center px-2 mt-2'>
        <div className='flex'>
          <button type='button' className={`p-1 `} onClick={() => handleLikeButton()}><FaRegHeart className={`${likes.includes(user._id) ? 'fill-red-400' : ''}`} /></button>
          <span>{likeCount}</span>
        </div>
        <div className='flex'>
          <button onClick={handleGettingComments}> <FaComment /> </button>
        </div>
      </div>

      {isOpen && (
        <SelectedPost
          post={post}
          user={user}
          likeCount={likeCount}
          likes={likes}
          handleLikeButton={handleLikeButton}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  )
}

export default Post