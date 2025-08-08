import React, { useRef, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { GoFileMedia } from "react-icons/go"
import { MdClose } from 'react-icons/md'
import toast from 'react-hot-toast'
import { PiPaperPlaneRightFill } from "react-icons/pi";
import { usePostStore } from '../../store/postStore'

const CommentInput = ({ postId , setComments}) => {
  const { user } = useAuthStore()
  const { uploadComment, getCommentsByPost } = usePostStore()

  const [text, setText] = useState('')
  const [media, setMedia] = useState([])
  const mediaInputRef = useRef(null)

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files)
    let newMedia = []

    files.forEach((file) => {
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')

      if (!isImage && !isVideo) return toast.error('Please select image or video')

      const reader = new FileReader()
      reader.onloadend = () => {
        newMedia.push({
          type: isImage ? 'image' : 'video',
          preview: reader.result,
          file,
        })
        if (newMedia.length === files.length) {
          setMedia((prev) => [...prev, ...newMedia])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeMedia = (index) => {
    setMedia((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUploadComment = async () => {
    if (!text.trim() && media.length == 0) return

    await uploadComment(postId, {text, media})

    const {comments} = await getCommentsByPost(postId)
    setComments(comments)
    setText('')
    setMedia([])
    if (mediaInputRef.current) mediaInputRef.current.value = ''
  }

  return (
    <div className="flex gap-2 pl-3 mr-3 pt-3">
      <img src={user.avatar} alt={user.username} className="rounded-full h-9 w-9" />

      <div className="bg-gray-600 rounded-xl w-full flex flex-col gap-2 p-3">

        {/* Media Preview */}
        {media.length > 0 && (
          <div className="flex gap-3 overflow-x-auto">
            {media.map((item, index) => (
              <div key={index} className="relative group">
                {item.type === 'image' ? (
                  <img
                    src={item.preview}
                    className="h-28 w-auto max-w-xs object-contain rounded-md"
                    alt="preview"
                  />
                ) : (
                  <video
                    src={item.preview}
                    className="h-28 w-auto max-w-xs object-contain rounded-md"
                    controls
                  />
                )}
                <button
                  onClick={() => removeMedia(index)}
                  className="absolute top-1 right-1 bg-black bg-opacity-60 rounded-full p-1 text-white hover:bg-opacity-90"
                >
                  <MdClose size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text Input and File Button */}
        <div className="flex items-center justify-between gap-2 pr-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="bg-transparent focus:outline-none w-full text-sm placeholder:text-gray-300"
            placeholder="Write a comment..."
          />
          <input
            type="file"
            className="hidden"
            ref={mediaInputRef}
            multiple
            accept="image/*,video/*"
            onChange={handleMediaChange}
          />
          <button
            type="button"
            onClick={() => mediaInputRef.current?.click()}
            className="text-gray-300 hover:text-white p-1 cursor-pointer"
          >
            <GoFileMedia size={20} />
          </button>
          <button>
            <PiPaperPlaneRightFill
              className={`${!text.trim() && media?.length === 0 ? 'disabled' : 'fill-blue-400 cursor-pointer'} `}
              onClick={handleUploadComment}
              size={20}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CommentInput
