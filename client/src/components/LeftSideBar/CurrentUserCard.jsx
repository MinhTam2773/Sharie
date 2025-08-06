import React, { useRef, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'
import { FaPaperclip } from 'react-icons/fa'

const CurrentUserCard = () => {
    const { user, isGettingCurrentUser } = useAuthStore()
    const [isOpen, setIsOpen] = useState(false)
    const [mediaPreviews, setMediaPreviews] = useState([])
    const mediaInputRef = useRef(null)

    const [formData, setFormData] = useState({
        caption: '',
        preview: null,
        mediaType: ''
    })

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

    const handleUploadPost = (e) => {
        e.preventDefault()
        // Add actual upload logic
        toast.success('Post uploaded (mock)')
        setIsOpen(false)
        setFormData({ caption: '', preview: null, mediaType: '' })
        setMediaPreviews([])
    }

    if (isGettingCurrentUser && !user) return <p>Loading...</p>

    return (
        <div className="w-9/10 p-4">
            {user && (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md p-6 flex flex-col items-center">
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
                        onSubmit={handleUploadPost}
                        className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg w-full max-w-lg p-6 relative"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" />
                            <span className="font-medium text-gray-800 dark:text-white">{user.username}</span>
                        </div>

                        <textarea
                            value={formData.caption}
                            onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                            placeholder="What's going on inside your head?"
                            rows={mediaPreviews.length > 0 ? 3 : 6}
                            className="w-full p-3 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        />

                        {mediaPreviews.length > 0 && (
                            <div className="space-y-3 my-4">
                                {mediaPreviews.map((preview, index) => (
                                    <div key={index} className="relative">
                                        {preview.type === 'image' ? (
                                            <img src={preview.preview} className="w-full rounded-lg" />
                                        ) : (
                                            <video src={preview.preview} controls className="w-full rounded-lg" />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeMedia(index)}
                                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                                        >
                                            ×
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
                                className="text-purple-600 hover:text-purple-800 transition"
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
