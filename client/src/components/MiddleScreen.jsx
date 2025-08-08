import React, { useEffect } from 'react'
import Post from './Posts/Post'
import { usePostStore } from '../store/postStore'
import { useAuthStore } from '../store/authStore'

const MiddleScreen = () => {
  const {getPostsFromFollowing, loadingPosts, posts} = usePostStore()
  const {accessToken} = useAuthStore()
  useEffect( () => {
    if (accessToken) {
      getPostsFromFollowing()
    }
  },[accessToken, getPostsFromFollowing] )

  if (loadingPosts) return <p>Loading...</p>

  return (
    <div className='w-full flex flex-col justify-center gap-5 mt-5'>
      {posts.length > 0 && posts.map(post => (
        <Post key={post._id} post={post}/>
        ))}
    </div>
  )
}

export default MiddleScreen