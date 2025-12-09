import React from 'react'
import { useAudioStore } from '../../store/audioStore'
import { useEffect } from 'react'
import { useState } from 'react'
import Comment from '../Posts/Comment'
import Spinner from '../loadings/Spinner'
import CommentInput from '../Posts/CommentInput'

const AudioComments = ({ audioId }) => {
    const { getComments, uploadComment, isGettingComment } = useAudioStore()

    const [comments, setComments] = useState([])
    useEffect(() => {
        const fetchComments = async () => {
            setComments(await getComments(audioId) || [])
        }
        fetchComments()
    }, [])

    if (isGettingComment) return (
        <Spinner />
    )

    return (
        <div className='w-full'>
            {comments?.length === 0 && (
                <p>No comments yet</p>
            )}

            {comments?.length > 0 && (
                <>
                    {comments.map(comment => (
                        <div key={comment._id}>
                            <Comment comment={comment} />
                        </div>
                    ))}
                </>
            )}

            {/* Comment Input */}
            <CommentInput refId={audioId} refModel={'Audio'} setComments={setComments}/>
        </div>
    )
}

export default AudioComments