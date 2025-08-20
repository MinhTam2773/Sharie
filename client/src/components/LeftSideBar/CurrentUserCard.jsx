import React, { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'
import { FaPaperclip } from 'react-icons/fa'
import { usePostStore } from '../../store/postStore'
import { MdClose } from 'react-icons/md'

const CurrentUserCard = () => {
    const { user, isGettingCurrentUser } = useAuthStore()
    const { uploadPost } = usePostStore()

    const [isOpen, setIsOpen] = useState(false)
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

    const handleUploadPost = async (e) => {
        e.preventDefault()

        const postData = { caption, media: mediaPreviews }
        const { success } = await uploadPost(postData)
        if (!success) return

        setIsOpen(false)
        setCaption('')
        setMediaPreviews([])
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (uploadPostRef.current && !uploadPostRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    if (isGettingCurrentUser && !user) return <p>Loading...</p>

    return (
        <div className="p-4 mt-18 fixed w-90">
            {user && (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md p-6 flex flex-col items-center w-5/6">
                    <img src={user.avatar} alt="avatar" className="w-20 h-20 rounded-full object-cover shadow" />
                    <p className="font-semibold text-lg mt-2">{user.username}</p>
                    <p className="text-gray-500 text-sm text-center mt-3 bg-amber-50 px-3 py-2 rounded-2xl">
                        {user.bio}
                    </p>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="mt-7 bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 text-white px-5 py-2 rounded-full transition"
                    >
                        Upload Post
                    </button>
                </div>
            )}

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <form
                        ref={uploadPostRef}
                        onSubmit={handleUploadPost}
                        className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg w-full max-w-lg p-6 relative z-50"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" />
                            <span className="font-medium text-gray-800 dark:text-white">{user.username}</span>
                        </div>

                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="What's going on inside your head?"
                            rows={mediaPreviews.length > 0 ? 3 : 6}
                            className="w-full p-3 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        />

                        {mediaPreviews.length > 0 && (
                            <div className="gap-3 pb-2 mt-2 flex overflow-x-auto">
                                {mediaPreviews.map((preview, index) => (
                                    <div key={index} className="relative group flex">
                                        {preview.type === 'image' ? (
                                            <img src={preview.preview} className="h-70 w-auto max-w-xs object-contain rounded-md" />
                                        ) : (
                                            <video src={preview.preview} controls className="h-70 w-auto max-w-xs object-contain rounded-md" />
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
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-800 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium"
                                >
                                    Upload
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default CurrentUserCard
