import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUserStore } from '../../store/userStore'
import ButtonsInProfile from './ButtonsInProfile'
import Posts from './TabsContent/Posts'
import Musics from './TabsContent/Musics'
import Reposts from './TabsContent/Reposts'

const Profile = () => {
    const { getTargetUser, selectedUser, isGettingTargetUser } = useUserStore()
    const { username } = useParams()

    const [activeTab, setActiveTab] = useState('Posts')

    const tabs = [
        { id: 'Posts', label: 'Posts' },
        { id: 'Music', label: 'Music' },
        { id: 'Reposts', label: 'Reposts' }
    ]

    useEffect(() => {
        if (username) {
            getTargetUser(username)
        }
    }, [username, getTargetUser])

    if (isGettingTargetUser) {
        return <div>Loading...</div>
    }

    if (!selectedUser) {
        return <div>User not found</div>
    }

    return (
        <div className="p-6 w-full mx-auto ">
            {/* Background image */}
            {selectedUser.backgroundImage && (
                <div className="w-full h-48 rounded-lg overflow-hidden mb-4 mt-17">
                    <img
                        src={selectedUser.backgroundImage}
                        alt={`${selectedUser.username}'s background`}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            <div className="absolute top-64 pl-2 pr-8 flex items-center md:gap-20  gap-20">
                {/* Avatar + username */}
                <div className="flex items-center gap-4 mb-4 mt-3 sm:mb-0">
                    <img
                        src={selectedUser.avatar}
                        alt={`${selectedUser.username}'s avatar`}
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover user-avatar"
                    />
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">
                            {selectedUser.nickname || selectedUser.username}
                        </h1>
                        <span className="text-gray-500">@{selectedUser.username}</span>
                    </div>
                </div>

                {/* Followers */}
                <div className="flex flex-col items-center  sm:mt-5">
                    <span className="text-lg sm:text-2xl font-semibold">{selectedUser.followers?.length}</span>
                    <span className="text-gray-500">Followers</span>
                </div>
            </div>

            {/* Bio */}
            <p className="text-white dark:text-gray-300 mt-24 sm:mt-32 px-3">
                {selectedUser.bio ? selectedUser.bio : ''}
            </p>

            <ButtonsInProfile />

            <div className="flex justify-center text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px">
                    {/* tab headers */}
                    {tabs.map(tab => (
                        <li
                            key={tab.id}
                            className="me-2"
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <a className={`${tab.id === activeTab ? 'text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500' : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'} inline-block p-4 border-b-2 border-transparent rounded-t-lg select-none`}>
                                {tab.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {/* tab content */}
            <div>
                {activeTab === 'Posts' && (<Posts userId={selectedUser._id}/>)} 
                {activeTab === 'Music' && (<Musics/>)} 
                {activeTab === 'Reposts' && (<Reposts userId={selectedUser._id}/>)} 
            </div>

        </div>
    )
}

export default Profile
