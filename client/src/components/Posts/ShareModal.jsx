import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'
import { FaPaperclip } from 'react-icons/fa'
import { usePostStore } from '../../store/postStore'
import { MdClose } from 'react-icons/md'


const ShareModal = forwardRef(({ originalPost, setIsSharing }, ref) => {
    const { user, isGettingCurrentUser } = useAuthStore()
    const { sharePost } = usePostStore()

    const [caption, setCaption] = useState('')
    const [mediaPreviews, setMediaPreviews] = useState([])
    const uploadPostRef = useRef(null)
    const mediaInputRef = useRef(null)

    const handleMediaPreview = (e) => {
        const files = Array.from(e.target.files)
        let newMedia = []

        files.forEach(file => {
            const isImage = file.type.startsWith('image/')
            const isVideo = file.type.startsWith('video/')
            if (!isImage && !isVideo) return toast.error('Please select an image or video')

            const reader = new FileReader()
            reader.onloadend = () => {
                newMedia.push({
                    type: isImage ? 'image' : 'video',
                    preview: reader.result,
                    file
                })
                if (newMedia.length === files.length) {
                    setMediaPreviews(prev => [...prev, ...newMedia])
                }
            }
            reader.readAsDataURL(file)
        })
    }

    const removeMedia = (index) => {
        setMediaPreviews(prev => prev.filter((_, i) => i !== index))
    }

    const handleSharePost = async (e) => {
        e.preventDefault()

        const postData = { caption, media: mediaPreviews }
        const { success, message } = await sharePost(originalPost._id, postData)
        console.log(message)
        if (!success) return

        setIsSharing(false)
        setCaption('')
        setMediaPreviews([])
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (uploadPostRef.current && !uploadPostRef.current.contains(e.target)) {
                setIsSharing(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    if (isGettingCurrentUser && !user) return <p>Loading...</p>

    return (
        <div className='fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50'>
            <div ref={ref} className=' rounded-xl w-full max-w-lg p-6 relative flex flex-col'>
                <div>
                    <form
                        ref={uploadPostRef}
                        onSubmit={handleSharePost}
                        className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg w-full max-w-lg p-6 relative"
                    >
                        {/* avatar and username */}
                        <div className="flex items-center gap-3 mb-4">
                            <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" />
                            <span className="font-medium text-gray-800 dark:text-white">{user.username}</span>
                        </div>

                        {/* caption */}
                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="What's going on inside your head?"
                            className="w-full p-3 text-sm rounded-md focus:outline-none resize-none overflow-y-auto"
                            style={{ 
                                minHeight: '10',
                                maxHeight: '8rem'
                             }} // ~40px (short default)
                            // onInput={(e) => {
                            //     e.target.style.height = 'auto';
                            //     e.target.style.height = `${e.target.scrollHeight}px`;
                            // }}
                        />

                        {/* media */}
                        {mediaPreviews.length > 0 && (
                            <div className="gap-3 pb-2 mt-2 flex overflow-x-auto">
                                {mediaPreviews.map((preview, index) => (
                                    <div key={index} className="relative group flex">
                                        {preview.type === 'image' ? (
                                            <img src={preview.preview} className="h-50 w-auto max-w-xs object-contain rounded-md" />
                                        ) : (
                                            <video src={preview.preview} controls className="h-50 w-auto max-w-xs object-contain rounded-md" />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeMedia(index)}
                                            className="absolute top-1 right-1 bg-black bg-opacity-60 rounded-full p-1 text-white hover:bg-opacity-90 cursor-pointer"
                                        >
                                            <MdClose size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className='border rounded-2xl p-2'>
                            {/* username  */}
                            <div className='flex gap-3 p-3'>
                                <img src={originalPost.author.avatar} alt={`${originalPost.author.username}'s avatar`} className='h-10 w-10 rounded-full' />
                                <p className='font-semibold'>{originalPost.author.username}</p>
                            </div>

                            {/* caption */}
                            {originalPost.caption && (
                                <div className='px-3 text-lg'>
                                    <p>{originalPost.caption}</p>
                                </div>)}

                            {/* media */}
                            <div>
                                {originalPost.media.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-3">
                                        {originalPost.media.map((media, index) => (
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

                        <input
                            type="file"
                            ref={mediaInputRef}
                            className="hidden"
                            onChange={handleMediaPreview}
                            multiple
                        />
                        <div className="flex justify-between items-center mt-4">
                            <button
                                type="button"
                                onClick={() => mediaInputRef.current?.click()}
                                className="text-purple-600 hover:text-purple-800 transition cursor-pointer select-none"
                            >
                                <FaPaperclip className="w-6 h-6" />
                            </button>

                            <div className="space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setIsSharing(false)}
                                    className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-800 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium"
                                >
                                    Share
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
})

export default ShareModal