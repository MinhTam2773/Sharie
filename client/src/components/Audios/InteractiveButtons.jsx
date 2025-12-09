import React, { useState } from 'react'
import { FaComment, FaRegHeart, FaShare } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useAuthStore } from '../../store/authStore';
import { useAudioStore } from '../../store/audioStore';
import SharedModal from './SharedModal';

const InteractiveButtons = ({ audioId }) => {
  const { user } = useAuthStore()
  const { audios, likeAudio, unlikeAudio } = useAudioStore()

  // find the latest audio object from the store
  const audio = audios.find(a => a._id === audioId)

  //like
  const hasLiked = audio?.likes?.includes(user._id)
  const handleLikeButton = () => {
    if (!hasLiked) {
      likeAudio(audio._id)
    } else {
      unlikeAudio(audio._id)
    }
  }

  //share
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='flex gap-6 content-center mt-4'>
      {/* like */}
      <div
        className='flex gap-1 items-center cursor-pointer'
        onClick={(e) => {
          e.stopPropagation()
          handleLikeButton()
        }}
      >
        <button type='button' className='cursor-pointer'>
          <FaRegHeart className={`${hasLiked ? 'fill-red-400' : ''}`} />
        </button>
        <span>{audio?.likeCount}</span>
      </div>

      {/* comments */}
      <div className='flex gap-1 items-center cursor-pointer'>
        <button
          className='cursor-pointer'
          type='button'
        >
          <FaComment />
        </button>
        <span>{audio?.commentCount}</span>
      </div>

      {/* share */}
      <div 
        className='flex gap-1 items-center cursor-pointer'
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(true)
        }}
      >
        <button className='cursor-pointer'><FaShare /></button>
        <span>{audio?.shareCount}</span>
      </div>

      {isOpen && (
        <>
          <SharedModal audioId={audioId} setIsOpen={setIsOpen} />
        </>
      )}
    </div>
  )
}


export default InteractiveButtons