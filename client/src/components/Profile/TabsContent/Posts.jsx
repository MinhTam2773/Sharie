import React, { useEffect, useState } from 'react'
import { usePostStore } from '../../../store/postStore'
import Post from '../../Posts/Post'

const Posts = ({ userId }) => {
    const { getPostsFromUser, isGettingPostsFromUser } = usePostStore()

    const [posts, setPosts] = useState([])

    useEffect(() => {
        const fetchPosts = async () => {
            setPosts(await getPostsFromUser(userId))
        }
        fetchPosts()
    }, [userId])

    if (isGettingPostsFromUser && posts?.length === 0) return <p>Loading posts...</p>

    if (!isGettingPostsFromUser && posts?.length === 0) return <p>This user hasn't posted anything</p>

    return (
        <div className='w-full flex flex-col justify-center gap-5 mt-5'>
            {posts.length > 0 && posts.map(post => (
                <Post key={post._id} post={post} />
            ))}

            <div className='text-center mt-4'>
                <p>You're caught up!</p>
            </div>
        </div>
    )
}

export default Posts