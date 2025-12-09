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
import { useNavigate } from 'react-router-dom';
import { BiRepost } from "react-icons/bi";

const Post = ({ post }) => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { likePost, unlikePost, repost, unRepost } = usePostStore()

  const [likeCount, setLikeCount] = useState(
    post.isReposted ? post.originalPost?.likeCount : post.likeCount
  )
  const [hasLiked, setHasLiked] = useState(
    post.isReposted
      ? post.originalPost?.likes?.some(id => id.toString() === user._id.toString())
      : post.likes.some(id => id.toString() === user?._id.toString())
  )

  const [reposted, setReposted] = useState(
    post.isReposted
      ? post.originalPost?.reposts?.some(id => id.toString() === user._id.toString())
      : post.reposts?.some(id => id.toString() === user._id.toString())
  )
  const [repostCount, setRepostCount] = useState(
    post.isReposted ? post.originalPost?.repostCount : post.repostCount || 0
  )


  const [isOpen, setIsOpen] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const selectedPostRef = useRef(null)
  const sharePostRef = useRef(null)

  const handleLikeButton = async () => {
    if (!hasLiked) {
      await likePost(post._id)
      setLikeCount(prev => prev += 1)
      setHasLiked(true)
    } else {
      await unlikePost(post._id)
      setLikeCount(prev => prev -= 1)
      setHasLiked(false)
    }
  }

  const handleGettingComments = async () => {
    setIsOpen(true)
  }

  const handleRepost = async () => {
    const repostId = !post.isReposted ? post._id : post.originalPost._id
    if (!reposted) {
      const { success } = await repost(repostId)
      if (success) {
        setReposted(true)
        setRepostCount(prev => prev += 1)
      }
    } else {
      const { success } = await unRepost(repostId)
      if (success) {
        setReposted(false)
        setRepostCount(prev => prev -= 1)
      }
    }
  }

  const handleNavigate = (user) => {
    navigate(`/${user.username}`)
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

      {post.isReposted && (
        <div className='px-10 pt-1 '>
          <p className='text-gray-500 flex gap-1 items-center' onClick={() => handleNavigate(post.author)}>
            <BiRepost className='size-5' /> <span className='hover:underline font-semibold cursor-pointer'>{post.author.username}</span> reposted</p>
        </div>
      )}
      {post.isReposted && !post.originalPost && (
        <div>Post unavailable</div>
      )}
      <div onClick={() => setIsOpen(true)}>


        {/* username  */}
        <div className='flex  gap-3 p-3'>
          <img src={post.isReposted ? post.originalPost?.author?.avatar : post.author.avatar} alt={`${post.author.username}'s avatar`} className='h-10 w-10 rounded-full cursor-pointer' onClick={() => handleNavigate(post.author)} />
          <p className='font-semibold cursor-pointer hover:underline' onClick={() => handleNavigate(post.isReposted ? post.originalPost?.author : post.author)}>{post.isReposted ? post.originalPost?.author?.username : post.author?.username}</p>
        </div>

        {/* caption */}
        <div className="px-3">
          <p className="text-lg">
            {post.isReposted ? post.originalPost?.caption : post.caption}
          </p>
        </div>

        {/* media */}
        {post.isReposted ? (
          <div>
            {post.originalPost?.media?.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-3">
                {post.originalPost.media.map((media, index) => (
                  <div key={index} className=" rounded-lg overflow-hidden bg-black">
                    {media.mediaType === 'image' ? (
                      <img
                        src={media.mediaUrl}
                        alt={`media-${index}`}
                        className="w-full h-50 object-cover hover:scale-105 transition-transform duration-300 z-0"
                      />
                    ) : (
                      <video
                        src={media.mediaUrl}
                        controls
                        className="w-full h-50 object-cover z-0"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {post.media?.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-3">
                {post.media.map((media, index) => (
                  <div key={index} className=" rounded-lg overflow-hidden bg-black">
                    {media.mediaType === 'image' ? (
                      <img
                        src={media.mediaUrl}
                        alt={`media-${index}`}
                        className="w-full h-50 object-cover hover:scale-105 transition-transform duration-300 z-0"
                      />
                    ) : (
                      <video
                        src={media.mediaUrl}
                        controls
                        className="w-full h-50 object-cover z-0"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* originalpost if is shared */}
        {post.isShared && !post.originalPost && (
          <div className=' bg-gray-900 rounded-2xl px-4 py-5 mx-2'>
            <p className='text-gray-600'>Post Unavailable</p>
          </div>
        )}

        {post.isShared && post.originalPost && (
          <div className=' border-2 border-gray-600 rounded-2xl p-2 mx-2'>
            {/* username  */}
            <div className='flex gap-3 p-3'>
              <img
                src={post.originalPost?.author?.avatar}
                alt={`${post.originalPost?.author?.username}'s avatar`}
                className='h-10 w-10 rounded-full cursor-pointer'
                onClick={() => handleNavigate(post.author)}
              />
              <p
                className='font-semibold cursor-pointer hover:underline'
                onClick={() => handleNavigate(post.author)}
              >
                {post.originalPost?.author?.username}
              </p>
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
                    <div key={index} className="rounded-lg overflow-hidden bg-black">
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
                          className="w-full h-30 object-cover z-0"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* like, commment, repost, share */}
        <div className='flex gap-6 content-center px-4 my-2'>

          {/* like */}
          <div className='flex gap-1 items-center cursor-pointer'
            onClick={(e) => {
              e.stopPropagation();
              handleLikeButton()
            }
            }>
            <button type='button' className='cursor-pointer' ><FaRegHeart className={`${hasLiked ? 'fill-red-400' : ''}`} /></button>
            <span>{likeCount}</span>
          </div>

          {/* comments */}
          <div className='flex gap-1 items-center cursor-pointer' onClick={handleGettingComments}>
            <button className=' cursor-pointer'> <FaComment /> </button>
            <span>{post.isReposted ? post.originalPost?.commentCount : post.commentCount}</span>
          </div>

          {/* repost */}
          <div className='flex gap-1 items-center cursor-pointer'>
            <button
              className='cursor-pointer'
              onClick={(e) => {
                e.stopPropagation()
                handleRepost()
              }}
            >
              <BiRepost className={`size-6 ${reposted ? 'fill-red-400' : ''}`} />
            </button>
            <span>{repostCount}</span>
          </div>

          {/* share */}
          <div className='flex gap-1 items-center cursor-pointer'
            onClick={(e) => {
              e.stopPropagation()
              setIsSharing(true)
            }}>
            <button className='cursor-pointer'><FaShare /></button>
            <span>{post.isReposted ? post.originalPost?.shares?.length : post.shares?.length}</span>
          </div>
        </div>
      </div>

      {/* modal: selected post */}
      {isOpen && (
        <SelectedPost
          ref={selectedPostRef}
          post={post.isReposted ? post.originalPost : post}
          likeCount={likeCount}
          hasLiked={hasLiked}
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