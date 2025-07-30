import React from 'react'
import { useChatStore } from '../../store/chatStore'
import { useAuthStore } from '../../store/authStore'

const ChatHeader = () => {
  const { selectedChat } = useChatStore()
  const currentUser = useAuthStore((state) => state.user)
  const { setSelectedChat } = useChatStore()

  if (!selectedChat) return <div className="p-4 text-white">No chat selected</div>

  const getChatHeader = () => {
    const { participants, name, groupAvatar } = selectedChat
    if (!participants || participants.length === 0) return {}

    if (participants.length === 2) {
      const otherUser = participants.find((user) => user._id !== currentUser._id)
      return {
        chatImage: otherUser?.avatar || '',
        chatName: otherUser?.username || 'Unknown'
      }
    }

    return {
      chatImage: groupAvatar || 'https://cdn-icons-png.flaticon.com/512/25/25694.png',
      chatName: name || 'Group Chat'
    }
  }

  const { chatImage, chatName } = getChatHeader()

  const handleReturn = () => {
    setSelectedChat(null)
  }

  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-white/10 backdrop-blur-sm bg-gradient-to-r from-purple-800 via-pink-600 to-indigo-700 shadow-md">
      <button
        onClick={handleReturn}
        className="text-white text-2xl font-bold hover:text-purple-300 transition"
        aria-label="Return to chat list"
      >
        &lt;
      </button>
      <img
        src={chatImage}
        alt="Chat avatar"
        className="w-10 h-10 rounded-full object-cover shadow-lg border border-white/20"
      />
      <h2 className="text-white text-lg font-semibold drop-shadow">{chatName}</h2>
    </div>
  )
}

export default ChatHeader
