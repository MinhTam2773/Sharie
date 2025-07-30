import React from 'react'
import { useAuthStore } from '../../store/authStore'

const CurrentUserCard = () => {
    const {user, isGettingCurrentUser} = useAuthStore

    if (isGettingCurrentUser) {
        // return <CurrentUserCardSkeleton/>
        return (<p>loading</p>)
    }
  return (
    <div>
        <img src={user.avatar} />
        <p>{user.username}</p>
        <p>{user.bio}</p>
    </div>
  )
}

export default CurrentUserCard