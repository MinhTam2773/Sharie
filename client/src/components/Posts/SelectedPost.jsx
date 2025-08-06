import React from 'react'
import { FaRegHeart, FaShare } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import Comment from './Comment';
import CommentInput from './CommentInput';
import { useEffect } from 'react'
import { useState } from 'react'
import { usePostStore } from '../../store/postStore'

const SelectedPost = ({
    post,
    user,
    likeCount,
    likes,
    handleLikeButton,
    setIsOpen
}) => {
    const {getCommentsByPost} = usePostStore()

    const [comments, setComments] = useState([])

    useEffect(() => {
        const getComments = async () => {
            const {comments} = await getCommentsByPost(post._id)
            setComments(comments)
        }
        getComments
    }, [comments, getCommentsByPost, post._id])

    return (
        <div className='fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50'>
            <div className='w-5/9 mx-auto bg-gray-800 flex flex-col rounded-2xl p-3'>

                {/* avatar and username */}
                <div className='flex gap-3 p-3'>
                    <img src={post.author.avatar} alt={`${post.author.username}'s avatar`} className='h-12 w-12 rounded-full' />
                    <p className='font-semibold'>{post.author.username}</p>
                    <button className='ml-auto self-start' onClick={() => setIsOpen(false)}><MdCancel className='h-7 w-7 fill-gray-500 hover:fill-gray-300' /></button>
                </div>

                {/* caption */}
                {post.caption && (
                    <div className='px-3 text-lg'>
                        <p>{post.caption}</p>
                    </div>)}

                {/* image or video */}
                {post.mediaType && (
                    <>
                        {post.mediaType === 'image'
                            ? <img src={post.mediaUrl} />
                            : <video src={post.mediaUrl} />
                        }</>
                )}

                {/* likes and shares */}
                <div className='flex gap-7 content-center px-2 mt-2'>
                    <div className='flex'>
                        <button type='button' className={`p-1 `} onClick={() => handleLikeButton()}><FaRegHeart className={`${likes.includes(user._id) ? 'fill-red-400' : ''}`} /></button>
                        <span>{likeCount}</span>
                    </div>
                    <div className='flex'>
                        <button><FaShare /></button>
                        <span>{post.shares.length}</span>
                    </div>
                </div>

                {/* hr bar */}
                <div className='bg-gray-500 w-97/100 self-center my-3 h-0.5'></div>

                {/* comments */}
                {comments.length == 0 && (
                    <div className='p-2 mb-1 flex justify-center items-center'>
                        <p>No comments yet</p>
                    </div>
                )}
                {comments && comments.map(comment => (
                    <div>
                        <Comment comment={comment} />
                    </div>
                ))}

                <CommentInput postId={post._id} setComments={setComments}/>
            </div>
        </div>
    )
}

export default SelectedPost