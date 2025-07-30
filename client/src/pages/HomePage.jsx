import React from 'react'
import SidebarRight from '../components/SidebarRight'
import ChatContainer from '../components/Chats/ChatContainer'
import { useChatStore } from '../store/chatStore'
import LeftSidebar from '../components/LeftSideBar/LeftSidebar'

const HomePage = () => {
    const {selectedChat} = useChatStore()
    return (
        <div>
            <LeftSidebar/>
            {selectedChat ? (<ChatContainer/>) : <SidebarRight/>}
        </div>
    )
}

export default HomePage