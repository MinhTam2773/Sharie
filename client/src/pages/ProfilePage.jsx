import React from 'react'
import { useChatStore } from '../store/chatStore'
import LeftSidebar from '../components/LeftSideBar/LeftSidebar'
import ChatContainer from '../components/Chats/ChatContainer'
import SidebarRight from '../components/RightSideBar/SidebarRight'
import Profile from '../components/Profile/Profile'

const ProfilePage = () => {
    const { selectedChat } = useChatStore()

    return (
        <div className='flex flex-col md:flex-row w-full gap-12 h-screen'>
            <div className='md:w-1/5 w-full hidden lg:block'>
                <LeftSidebar />
            </div>
            <div className='lg:w-2/4  w-full'>
                <Profile/>
            </div>
            <div className='lg:w-1/4 w-3/5 md:block hidden'>
                {selectedChat ? <ChatContainer /> : <SidebarRight />}
            </div>
        </div>
    )
}

export default ProfilePage