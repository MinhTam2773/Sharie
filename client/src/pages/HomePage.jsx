import React from 'react'
import SidebarRight from '../components/SidebarRight'
import ChatContainer from '../components/Chats/ChatContainer'
import { useChatStore } from '../store/chatStore'
import LeftSidebar from '../components/LeftSideBar/LeftSidebar'
import MiddleScreen from '../components/MiddleScreen'

const HomePage = () => {
    const { selectedChat } = useChatStore()
    return (
        <div className='flex flex-col md:flex-row w-full gap-12 h-screen'>
            <div className='md:w-1/5 w-full'>
                <LeftSidebar />
            </div>
            <div className='md:w-2/4 w-full'>
                <MiddleScreen />
            </div>
            <div className='md:w-1/4 w-full'>
                {selectedChat ? <ChatContainer /> : <SidebarRight />}
            </div>
        </div>
    )
}

export default HomePage