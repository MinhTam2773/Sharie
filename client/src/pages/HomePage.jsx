import React from 'react'
import SidebarRight from '../components/RightSideBar/SidebarRight'
import ChatContainer from '../components/Chats/ChatContainer'
import LeftSidebar from '../components/LeftSideBar/LeftSidebar'
import MiddleScreen from '../components/MiddleScreen'
import Chats from '../components/RightSideBar/Chats'

const HomePage = () => {

    return (
        <div className='flex flex-col md:flex-row w-full gap-12 h-screen'>
            <div className='md:w-1/5 w-full hidden lg:block'>
                <LeftSidebar />
            </div>
            <div className='lg:w-2/4 md:w-5/8 w-full'>
                <MiddleScreen />
            </div>
            <div className='lg:w-1/5 w-2/5 md:block hidden'>
                <Chats/>
            </div>
        </div>
    )
}

export default HomePage