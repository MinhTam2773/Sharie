import mongoose from "mongoose";
import { MediaSchema } from "./media.model.js";

const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    commentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        default: ''
    },
    media: [MediaSchema], //array of media objects
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    },
    likeCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const Comment = mongoose.model('Comment', commentSchema)
export default Comment