import React from 'react'
import { useUserStore } from '../../store/userStore'
import { useChatStore } from '../../store/chatStore'
import { useAuthStore } from '../../store/authStore'

const ButtonsInProfile = () => {
    const { followStatus, follow, unfollow, selectedUser } = useUserStore()
    const { findChat } = useChatStore()
    const { user } = useAuthStore()

    return (
        <div className='flex mt-5 gap-15 justify-center'>
            {user._id !== selectedUser._id && (
                <>
                    {followStatus ?
                        (<button
                            className='bg-gray-800 px-4 py-2 rounded-xl hover:bg-gray-700 font-semibold'
                            onClick={() => unfollow()}
                        >
                            Following
                        </button>)
                        :
                        (<button
                            className='bg-blue-500 px-4 py-2 rounded-xl hover:bg-blue-400 font-semibold'
                            onClick={() => follow()}
                        >Follow</button>)}

                    <button className='bg-gray-800 px-4 py-2 rounded-xl hover:bg-gray-700 font-semibold'
                        onClick={() => findChat(selectedUser)}
                    >Message</button>
                </>
            )}

            {user._id === selectedUser._id && (
                <>
                    <button
                        className='bg-gray-800 px-4 py-2 rounded-xl hover:bg-gray-700 font-semibold'
                    >
                        Edit Profile
                    </button>
                    <button
                        className='bg-gray-800 px-4 py-2 rounded-xl hover:bg-gray-700 font-semibold'
                    >
                        Share Profile
                    </button>
                </>
            )}
        </div>
    )
}

export default ButtonsInProfile