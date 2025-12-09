import React, { useEffect, useRef } from 'react'
import ProgressBar from './ProgressBar'
import { Play, Pause } from "lucide-react";
import InteractiveButtons from './InteractiveButtons';
import AudioComments from './AudioComments';

const AudioModal = ({ audio, setIsOpen, audioRef, duration, values, isPlaying, setValues, togglePlay }) => {
  const modalRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className='bg-zinc-800 rounded-xl shadow-lg w-full max-w-lg p-6 relative z-50'
      >
        {/* username && avatar */}
        <div className='flex gap-2'>
          <img
            className='w-8 h-8 rounded-full'
            src={audio.uploadedBy.avatar}
          />
          <span>{audio.uploadedBy.nickname}</span>
        </div>

        {/* audio  */}
        <div className="flex flex-col w-full">

          {/* cover image */}
          <img
            src={audio.coverImage}
            className="h-50 w-50 rounded-xl self-center"
          />

          {/* title */}
          <h2 className="text-white text-center font-bold text-lg mt-2">{audio.title}</h2>

          {/* player controls */}
          <ProgressBar
            duration={duration}
            audioRef={audioRef}
            values={values}
            setValues={setValues}
          />

          {/* play pause button */}
          <button
            type='button'
            onClick={togglePlay}
            className="cursor-pointer self-center h-9 mt-5 w-9 flex justify-center items-center bg-gray-600 rounded-full text-white"
          >
            {isPlaying
              ? <Pause className="fill-white " />
              : <Play className="fill-white" />}
          </button>

          {/* Interactive buttons */}
          <InteractiveButtons audioId={audio._id}/>

          {/* Comments */}
          <AudioComments audioId={audio._id} />
        </div>
      </div>
    </div>
  )
}

export default AudioModal