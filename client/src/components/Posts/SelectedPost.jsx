import React from 'react'
import { FaRegHeart, FaShare } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import Comment from './Comment';
import CommentInput from './CommentInput';
import { useEffect } from 'react'
import { useState } from 'react'
import { usePostStore } from '../../store/postStore'
import { forwardRef } from 'react';

const SelectedPost = forwardRef(({
    post,
    likeCount,
    handleLikeButton,
    setIsOpen,
    hasLiked
}, ref) => {
    const { getCommentsByPost } = usePostStore()

    const [comments, setComments] = useState([])

    useEffect(() => {
        const getComments = async () => {
            const { comments } = await getCommentsByPost(post._id)
            setComments(comments)
        }
        getComments()
    }, [getCommentsByPost, post._id, comments])

    return (
        <div className='fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50'>
            <div ref={ref} className='w-5/9 mx-auto bg-gray-800 flex flex-col rounded-2xl p-3'>

                {/* avatar and username */}
                <div className='flex gap-3 p-3'>
                    <img src={post.author.avatar} alt={`${post.author.username}'s avatar`} className='h-12 w-12 rounded-full' />
                    <p className='font-semibold'>{post.author.username}</p>
                    <button className='ml-auto self-start' onClick={() => { setIsOpen(false) }}><MdCancel className='h-7 w-7 fill-gray-500 hover:fill-gray-300' /></button>
                </div>

                <div className='max-h-[70vh] overflow-y-auto scrollbar-hide'>

                    {/* caption */}
                    {post.caption && (
                        <div className='px-3 text-lg'>
                            <p>{post.caption}</p>
                        </div>)}

                    {/* image or video */}
                    <div className="flex overflow-x-auto gap-2 p-3 scrollbar-hide">
                        {post.media.map((media, index) => (
                            <div key={index} className="flex-shrink-0 w-72 h-72 relative rounded-lg overflow-hidden bg-black">
                                {media.mediaType === 'image' ? (
                                    <img src={media.mediaUrl} alt={`media-${index}`} className="w-full h-full object-cover" />
                                ) : (
                                    <video src={media.mediaUrl} controls className="w-full h-full object-cover" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* likes and shares */}
                    <div className='flex gap-7 content-center px-2 mt-2'>
                        <div className='flex'>
                            <button type='button' className={`p-1 `} onClick={() => handleLikeButton()}><FaRegHeart className={`${hasLiked ? 'fill-red-400' : ''}`} /></button>
                            <span>{likeCount}</span>
                        </div>
                        <div className='flex'>
                            <button><FaShare /></button>
                            <span>{post.shares.length}</span>
                        </div>
                    </div>

                    {/* hr bar */}
                    <div className='bg-gray-500 w-97/100 self-center ml-3 my-2 h-0.5'></div>

                    {/* comments */}
                    <div className="pr-2">
                        {comments?.length === 0 ? (
                            <div className='p-2 mb-1 flex justify-center items-center'>
                                <p>No comments yet</p>
                            </div>
                        ) : (
                            comments.map(comment => (
                                <div key={comment._id}>
                                    <Comment comment={comment} />
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <CommentInput refId={post._id} refModel={'Post'} setComments={setComments} />
            </div>
        </div>
    )
})

export default SelectedPost