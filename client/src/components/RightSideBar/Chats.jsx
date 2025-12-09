import React, { useEffect } from 'react'
import { getOtherUser, useChatStore } from '../../store/chatStore'
import ChatHeader from '../Chats/ChatHeader'
import ChatContainer from '../Chats/ChatContainer'
import { useAuthStore } from '../../store/authStore'

const Chats = () => {
    const { chats, getChats, isLoadingChats, setSelectedChat, selectedChat, subcribeToMessage, unSubscribeToMessage } = useChatStore()
    const { socket, user } = useAuthStore()

    useEffect(() => {
        getChats()
        if (socket) subcribeToMessage()

        return () => unSubscribeToMessage();
    }, [socket])

    if (chats.length == 0 || isLoadingChats) return <p>loadingChats</p>

    if (chats.length == 0) return <p>get some friends</p>

    return (
        <div className='fixed right-0 w-80 top-20'>
            {chats.map((chat) => {
                const otherUser = getOtherUser(chat);
                const chatImage = chat.isGroup ? chat.groupAvatar : otherUser.avatar
                const chatName = chat.isGroup ? chat.name : otherUser.nickname
                const lastMessage = chat.lastMessage?.text
                    ? chat.lastMessage?.text
                    : chat.lastMessage?.mediaUrl ? 'Sent a media' : 'No message yet'
                const hasSeen = chat.lastMessage.seenBy.some(userId => userId === user._id)

                return (
                    <div key={chat._id} className=''>
                        <div

                            className="flex items-center w-full gap-3 p-2 hover:bg-gray-700 rounded-lg cursor-pointer"
                            onClick={() => setSelectedChat(chat, chatImage, chatName)}
                        >
                            <img
                                src={chatImage}
                                alt={`${chatName}'s avatar`}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-white font-semibold truncate max-w-[180px]">{chatName}</span>
                                <p className={`${hasSeen ? 'text-purple-300': 'text-white font-semibold'  }  text-sm truncate max-w-[180px]`}>{lastMessage}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
            {selectedChat && (
                <div className='absolute top-0 w-80'>
                    <ChatContainer chat={selectedChat} />
                </div>
            )}
        </div>
    );

}

export default Chats