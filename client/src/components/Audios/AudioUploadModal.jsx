import React, { useRef, useState, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useUIStore } from '../../store/UIstore'
import { TbMusicUp } from "react-icons/tb";
import AudioTrimSlider from './AudioTrimSlider';
import Dropdown from './Dropdown'
import { RiImageAddLine } from "react-icons/ri";
import { FaPlay, FaPause } from "react-icons/fa";
import { useAudioStore } from '../../store/audioStore';
import { buildFormData } from '../../lib/buildFormData';

const AudioUploadModal = () => {
    const { user } = useAuthStore()
    const { setAudioUploadModelOpen } = useUIStore()
    const { uploadAudio } = useAudioStore()

    const uploadAudioModalRef = useRef(null)

    //for cover image preview
    const imageCoverInputRef = useRef(null)
    const [imagePreview, setImagePreview] = useState(user.avatar)
    const [coverImage, setCoverImage] = useState(user.avatar)

    //variables for audio previews
    const audioInputRef = useRef(null)
    const audioRef = useRef(null)
    const [audioPreview, setAudioPreview] = useState(null)
    const [audio, setAudio] = useState(null)
    const [duration, setDuration] = useState(0)
    const [start, setStart] = useState(0)
    const [end, setEnd] = useState(30)
    const [isPlaying, setIsPlaying] = useState(false)

    //for collection name (optional)
    const [selectedCollection, setSelectedCollection] = useState({name: `${user.nickname}'s collection`})

    //form varibles
    const [form, setForm] = useState({
        title: '',
        collectionName: selectedCollection,
        start,
        end,
        duration,
    })


    // handle clicking outside modal
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (uploadAudioModalRef.current && !uploadAudioModalRef.current.contains(e.target)) {

                setAudioUploadModelOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setImagePreview(url)
            setCoverImage(file)
        }
    }

    const handleAudioPreview = (e) => {
        const file = e.target.files[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setAudioPreview(url)
            setAudio(file)
        }
    }

    // set duration when metadata is loaded
    const handleLoadedMetadata = () => {
        const d = audioRef.current.duration
        setDuration(d)
        setEnd(Math.min(30, d)) // default to 30s or shorter if audio < 30s
    }

    // update time tracking
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            // stop playback at "end"
            if (audioRef.current.currentTime >= end) {
                audioRef.current.pause()
                setIsPlaying(false)
            }
        }
    }

    const togglePlay = () => {
        if (!audioRef.current) return
        if (isPlaying) {
            audioRef.current.pause()
            setIsPlaying(false)
        } else {
            audioRef.current.currentTime = start
            audioRef.current.play()
            setIsPlaying(true)
        }
    }

    const handleUploadAudio = async () => {
        const formData = buildFormData(
            {
                title: form.title,
                collectionName: selectedCollection.name,
                start,
                end,
                duration,
            },
            {
                audio,
                coverImage
            }
        )
        setAudioUploadModelOpen(false)
        await uploadAudio(formData, selectedCollection._id)        
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <form
                ref={uploadAudioModalRef}
                className='bg-white dark:bg-zinc-800 rounded-xl shadow-lg w-full max-w-lg p-6 relative z-50'
            >
                {/* avatar and username */}
                <div className="flex items-center gap-3 mb-4">
                    <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" />
                    <span className="font-medium text-gray-800 dark:text-white select-none">{user.username}</span>
                </div>

                {audioPreview && imagePreview && (
                    <div className='flex items-start gap-5'>
                        {/* Cover Image */}
                        <img
                            src={imagePreview}
                            className='rounded-2xl h-30 w-30 object-cover'
                        />

                        <div className='w-full flex flex-col'>
                            {/* title input*/}
                            <input
                                placeholder='Audio name - Artist'
                                className='focus:outline-none w-full mt-2 font-semibold placeholder-gray-500'
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                value={form.title}
                            />

                            {/* collection: adding collection name */}
                            <Dropdown selectedCollection={selectedCollection} setSelectedCollection={setSelectedCollection} />

                            {/* change coverImage button */}
                            <input
                                type='file'
                                className='hidden'
                                ref={imageCoverInputRef}
                                accept='image/*'
                                onChange={handleImageChange}
                            />
                            <button
                                type='button'
                                className='size-8 flex items-center mt-8 cursor-pointer'
                                onClick={() => imageCoverInputRef.current?.click()}
                            >
                                <RiImageAddLine className='size-6 fill-blue-200' />
                            </button>
                        </div>
                    </div>
                )}

                {/* audio player */}
                {audioPreview && (
                    <div className="mb-4">
                        <audio
                            ref={audioRef}
                            src={audioPreview}
                            onLoadedMetadata={handleLoadedMetadata}
                            onTimeUpdate={handleTimeUpdate}
                            className="hidden"
                        />

                        {duration && (<AudioTrimSlider
                            duration={duration}
                            start={start}
                            end={end}
                            onChange={([newStart, newEnd]) => {
                                setStart(newStart);
                                setEnd(newEnd);
                            }}
                        />)}
                    </div>
                )}

                {/* File input + audio name, buttons */}
                <div className='flex gap-5 items-center mt-7'>

                    {/* file input */}
                    <input
                        type='file'
                        accept="audio/*,video/*"
                        ref={audioInputRef}
                        className='hidden'
                        onChange={handleAudioPreview}
                    />
                    <button
                        className='cursor-pointer h-12 w-12 flex items-center justify-center rounded-full'
                        type='button'
                        onClick={() => audioInputRef.current?.click()}
                    >
                        <TbMusicUp className='size-7' />
                    </button>

                    {/* Play button + time */}
                    {audioPreview && (
                        <div className="flex items-center gap-3 mt-1">
                            <button
                                type="button"
                                onClick={() => {
                                    audioRef.current.currentTime = start
                                    audioRef.current.play()
                                    setIsPlaying(true)
                                }}
                                className="bg-gray-700 hover:bg-gray-600 cursor-pointer text-white font-semibold px-3 py-1 rounded-full"
                            >
                                Restart
                            </button>
                            <button
                                type="button"
                                onClick={togglePlay}
                                className="bg-gray-700 hover:bg-gray-600 cursor-pointer text-white px-7 py-2 rounded-full"
                            >
                                {isPlaying ? <FaPause className='size-4' /> : <FaPlay className='size-4' />}
                            </button>
                        </div>)}

                    {/* upload button */}
                    {audioPreview && form.title.trim() && (
                        <div
                            className='cursor-pointer bg-blue-500 hover:bg-blue-400 font-semibold p-2 h-10 w-15 text-center ml-auto rounded-xl self-end '
                            onClick={(e) => {
                                e.preventDefault()
                                handleUploadAudio()
                            }}
                        >
                            <button
                            >
                                Post
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    )
}

export default AudioUploadModal
