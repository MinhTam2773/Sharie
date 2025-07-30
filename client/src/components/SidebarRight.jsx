import React, { useEffect } from 'react'
import { useChatStore } from '../store/chatStore'
import SideBarRightLoading from './loadings/sideBarRightLoading'
import { useAuthStore } from '../store/authStore'

const SidebarRight = () => {
  const { chats, getChats, isLoadingChats, setSelectedChat } = useChatStore()
  const { accessToken, user } = useAuthStore()

  useEffect(() => {
    if (accessToken) getChats()
  }, [accessToken, getChats])

  const getChatHeader = (chat) => {
    const { participants } = chat
    if (!participants || participants.length === 0) return {}

    try {
      if (participants.length === 2) {
        // Get other user
        const currentUserId = useAuthStore.getState().user._id
        const otherUser = participants.find((p) => p._id !== currentUserId)
        if (otherUser) {
          return {
            chatImage: otherUser.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            chatName: otherUser.username || 'Unknown User',
          }
        }
      } else if (participants.length > 2) {
        return chat.isGroup && !chat.groupAvatar
          ? {
              chatImage:
                "https://imgs.search.brave.com/tvMCgAX8SvWUIvMaQjT8gS1eLa1NGS_ApufM2cbXzYE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvcHJldmll/dy0xeC8zNy8xNi90/ZWFtLWdyb3VwLXBl/b3BsZS1hdmF0YXIt/Y293b3JraW5nLW9m/ZmljZS12ZWN0b3It/MzMzOTM3MTYuanBn",
              chatName: chat.name || 'Group Chat',
            }
          : { chatImage: chat.groupAvatar || '', chatName: chat.name || 'Group Chat' }
      }
    } catch (e) {
      console.error(e)
      return {}
    }
  }

  if (isLoadingChats && !user) return <SideBarRightLoading />

  return (
    <aside className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-gradient-to-b from-purple-950 to-indigo-950 border-l border-purple-500/20 shadow-xl overflow-y-auto">
      {chats.length === 0 && (
        <div className="p-4 text-center text-gray-400">No chats available</div>
      )}
      {chats.map((chat) => {
        const { chatImage, chatName } = getChatHeader(chat)
        const lastMessageText =
          typeof chat.lastMessage === 'string'
            ? chat.lastMessage
            : chat.lastMessage.mediaUrl ? 'sent a media' : ''

        return (
          <div
            key={chat._id}
            role="button"
            tabIndex={0}
            onClick={() => setSelectedChat(chat)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setSelectedChat(chat)
            }}
            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-purple-700 transition rounded-md"
          >
            <img
              src={chatImage}
              alt={`${chatName} avatar`}
              className="w-12 h-12 rounded-full object-cover border border-white/20 shadow-md"
              onError={(e) => (e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png')}
            />
            <div className="flex flex-col overflow-hidden">
              <p className="text-white font-semibold truncate max-w-[180px]">{chatName}</p>
              <p className="text-purple-300 text-sm truncate max-w-[180px]">
                {lastMessageText || 'No messages yet'}
              </p>
            </div>
          </div>
        )
      })}
    </aside>
  )
}

export default SidebarRight
