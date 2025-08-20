import mongoose from "mongoose";
import { MediaSchema } from "./media.model.js";

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    caption: {
        type: String,
        default: ''
    },
    media: [MediaSchema],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    commentCount:{
        type: Number,
        default: 0
    },
    shares: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    reposts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isShared: {
        type: Boolean,
        default: false
    },
    isReposted: {
        type: Boolean,
        default: false
    },
    originalPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
}, { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } })

postSchema.virtual('likeCount').get(function () { return this.likes?.length || 0})
postSchema.virtual('repostCount').get(function () { return this.reposts?.length || 0})

postSchema.post('findOneAndDelete', async (post) => {
    try {
        if (post && post.isReposted && post.originalPost) {
            await mongoose.model("Post").findByIdAndUpdate(
                post.originalPost,
                {
                    $pull: { reposts: post.author }
                }
            )
            console.log('unrepost successfully')
        }

        if (post && post.isShared && post.originalPost) {
            await mongoose.model("Post").findByIdAndUpdate(
                post.originalPost,
                {
                    $pull: { shares: post.author }
                }
            )
        }
    } catch (e) {
        console.error(e.message)
    }
})

const Post = mongoose.model('Post', postSchema)
export default Post