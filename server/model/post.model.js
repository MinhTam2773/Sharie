import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    caption: {
        type: String,
        default: ''
    },
    mediaUrl: {
        type: String
    },
    mediaType: {
        type: String,
        enum: ["image", "video"],
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    shares: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    commentCount: {
        type: Number,
        default: 0
    },
    likeCount: {
        type: Number,
        default: 0
    },
    isShared: {
        type: Boolean,
        default: false
    },
    originalPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
}, { timestamps: true })

const Post = mongoose.model('Post', postSchema)
export default Post