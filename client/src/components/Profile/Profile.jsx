import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useUserStore } from '../../store/userStore'
import { useChatStore } from '../../store/chatStore'

const Profile = () => {
    const { getTargetUser, selectedUser, isGettingTargetUser, followStatus, follow, unfollow } = useUserStore()
    const { username } = useParams()
    const { findChat } = useChatStore()

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
                <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
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
            <p className="text-gray-700 dark:text-gray-300 mt-24 sm:mt-32 px-3">
                {selectedUser.bio ? selectedUser.bio : '' }
            </p>

            {/* buttons */}
            <div className='flex mt-2 gap-15 justify-center'>
                {followStatus ?
                    <button
                        className='bg-gray-800 px-4 py-2 rounded-xl hover:bg-gray-700 font-semibold'
                        onClick={() => unfollow()}
                    >Following
                    </button>
                    :
                    <button
                        className='bg-blue-500 px-4 py-2 rounded-xl hover:bg-blue-400 font-semibold'
                        onClick={() => follow()}
                    >Follow</button>}

                <button className='bg-gray-800 px-4 py-2 rounded-xl hover:bg-gray-700 font-semibold'
                    onClick={() => findChat(selectedUser)}
                >Message</button>
            </div>
        </div>
    )
}

export default Profile
