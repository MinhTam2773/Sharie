import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    commentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        default: ''
    },
    mediaUrl: {
        type: String
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    },
}, { timestamps: true })

const Comment = mongoose.model('Comment', commentSchema)
export default Comment