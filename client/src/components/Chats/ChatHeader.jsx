import React from 'react'
import { useChatStore } from '../../store/chatStore'

const ChatHeader = () => {
  const { setSelectedChat, selectedChat } = useChatStore()

  // if (!selectedChat) return <div className="p-4 text-white">No chat selected</div>

  return (
    <div className="flex w-80 items-center gap-4 px-4 py-3 border-b border-white/10 backdrop-blur-sm bg-gradient-to-r from-purple-800 via-pink-600 to-indigo-700 shadow-md">
      <button
        onClick={() => setSelectedChat(null)}
        className="text-white text-2xl font-bold hover:text-purple-300 transition"
        aria-label="Return to chat list"
      >
        &lt;
      </button>
      <img
        src={selectedChat.chatImage}
        alt="Chat avatar"
        className="w-10 h-10 rounded-full object-cover shadow-lg border border-white/20"
      />
      <h2 className="text-white text-lg font-semibold drop-shadow">{selectedChat.chatName}</h2>
    </div>
  )
}

export default ChatHeader
