import React, { useState } from 'react'
import { FaComment, FaRegHeart, FaShare } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useAuthStore } from '../../store/authStore'
import { usePostStore } from '../../store/postStore'
import CommentInput from './CommentInput';
import { MdCancel } from "react-icons/md";
import SelectedPost from './SelectedPost';
import { useRef } from 'react';
import { useEffect } from 'react';
import ShareModal from './ShareModal';

const Post = ({ post }) => {
  const { user } = useAuthStore()
  const { likePost, unlikePost } = usePostStore()

  const [likeCount, setLikeCount] = useState(post.likeCount)
  const [likes, setLikes] = useState(post.likes)
  const [hasLiked, setHasLiked] = useState(post.likes.includes(user._id))

  const [isOpen, setIsOpen] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const selectedPostRef = useRef(null)
  const sharePostRef = useRef(null)

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

  const handleSharePost = () => {
    setIsSharing(true)
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectedPostRef.current && !selectedPostRef.current.contains(e.target)) {
        setIsOpen(false)
      }
      if (sharePostRef.current && !sharePostRef.current.contains(e.target)) {
        setIsSharing(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])


  return (
    <div className='w-5/6 mx-auto bg-gray-800 flex flex-col rounded-2xl'>
      <div onClick={() => setIsOpen(true)}>
        {/* username  */}
        <div className='flex gap-3 p-3'>
          <img src={post.author.avatar} alt={`${post.author.username}'s avatar`} className='h-10 w-10 rounded-full' />
          <p className='font-semibold'>{post.author.username}</p>
        </div>

        {/* caption */}
        {post.caption && (
          <div className='px-3 text-lg'>
            <p>{post.caption}</p>
          </div>)}

        {/* media */}
        <div>
          {post.media.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-3">
              {post.media.map((media, index) => (
                <div key={index} className="relative rounded-lg overflow-hidden bg-black">
                  {media.mediaType === 'image' ? (
                    <img
                      src={media.mediaUrl}
                      alt={`media-${index}`}
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <video
                      src={media.mediaUrl}
                      controls
                      className="w-full h-64 object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* originalpost if is shared */}
        {post.originalPost && (
          <div className='border rounded-2xl p-2'>
            {/* username  */}
            <div className='flex gap-3 p-3'>
              <img src={post.originalPost?.author.avatar} alt={`${post.originalPost?.author.username}'s avatar`} className='h-10 w-10 rounded-full' />
              <p className='font-semibold'>{post.originalPost?.author.username}</p>
            </div>

            {/* caption */}
            {post.originalPost?.caption && (
              <div className='px-3 text-lg'>
                <p>{post.originalPost?.caption}</p>
              </div>)}

            {/* media */}
            <div>
              {post.originalPost?.media?.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-3">
                  {post.originalPost?.media.map((media, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden bg-black">
                      {media.mediaType === 'image' ? (
                        <img
                          src={media.mediaUrl}
                          alt={`media-${index}`}
                          className="w-full h-30 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <video
                          src={media.mediaUrl}
                          controls
                          className="w-full h-30 object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* like, commment, share */}
        <div className='flex gap-6 content-center px-2 my-2'>
          <div className='flex cursor-pointer'
            onClick={(e) => {
              e.stopPropagation();
              handleLikeButton()
            }
            }>
            <button type='button' className='p-1 cursor-pointer' ><FaRegHeart className={`${likes.includes(user._id) ? 'fill-red-400' : ''}`} /></button>
            <span>{likeCount}</span>
          </div>
          <div className='flex cursor-pointer' onClick={handleGettingComments}>
            <button className='p-1 cursor-pointer'> <FaComment /> </button>
            <span>{post.commentCount}</span>
          </div>
          <div className='flex'
            onClick={(e) => {
              e.stopPropagation()
              handleSharePost()
            }}>
            <button className='p-1'><FaShare /></button>
            <span>{post.shares.length}</span>
          </div>
        </div>
      </div>

      {/* modal: selected post */}
      {isOpen && (
        <SelectedPost
          ref={selectedPostRef}
          post={post}
          user={user}
          likeCount={likeCount}
          likes={likes}
          handleLikeButton={handleLikeButton}
          setIsOpen={setIsOpen}
        />
      )}

      {/* modal: sharing */}
      {isSharing && (
        <ShareModal originalPost={post} setIsSharing={setIsSharing} ref={sharePostRef} />
      )}
    </div>
  )
}

export default Post