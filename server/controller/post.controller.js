import Post from "../model/post.model.js";
import User from "../model/user.model.js";
import { sendNotification } from "../lib/utils.js";

export const uploadNewPost = async (req, res) => {
    try {
        const userId = req.decoded.id
        const { caption, mediaUrl, mediaType } = req.body //

        if (!caption && !mediaType && !mediaUrl) {
            return res.status(401).json({ success: false, message: 'controller/uploadNewPost: please atleast have a caption' })
        } else if ((!mediaType && mediaUrl) || (mediaType && !mediaUrl)) {
            return res.status(401).json({ success: false, message: 'controller/uploadNewPost: please specify mediaUrl && mediaType' })
        }

        const newPost = await Post.create({
            authorId: userId,
            caption,
            mediaType,
            mediaUrl
        })
        if (!newPost) {
            return res.status(401).json({ success: false, message: 'controller/uploadNewPost: cant create new post' })
        }

        await sendNotification(userId,null, 'post', 'Post uploaded successfully')

        res.status(200).json({ success: true, message: 'post uploaded successfully', newPost })
    } catch (err) {
        res.status(400).json({ success: false, message: `controller/uploadNewPost: ${err.message}` })
    }
}

export const getPost = async (req, res) => {
    try {
        const postId = req.params.id

        const post = await Post.findById(postId)
        if (!post) {
            return res.status(401).json({ success: false, message: 'controller/getPost: post not found' })
        }

        res.status(200).json({ success: true, message: "get post successfuly", post })
    } catch (err) {
        res.status(400).json({ success: false, message: `controller/getPost: ${err.message}` })
    }
}

export const getPostsFromFollowing = async (req, res) => {
    try {
        const currentUserId = req.decoded.id
        const currentUser = await User.findById(currentUserId)
        if (!currentUser) {
            return res.status(401).json({ success: false, message: "controller/getPostsFromFollowing: user not found" })
        }

        const posts = await Post.find()
        const postsFromFollowing = posts.filter((post) => currentUser.following.includes(post.authorId))

        res.status(200).json({ success: true, message: "get posts from following successfully", postsFromFollowing })
    } catch (err) {
        res.status(400).json({ success: false, message: `controller/getPostsFromFollowing: ${err.message}` })
    }
}

export const getPostsFromUser = async (req, res) => {
    try {
        const userId = req.params.id

        const posts = await Post.find()
        const postsFromUser = posts.filter((post) => (String(post.authorId) === String(userId)))

        res.status(200).json({ success: true, message: "get posts from user successfully", postsFromUser })
    } catch (err) {
        res.status(400).json({ success: false, message: `controller/getPostsFromFollowing: ${err.message}` })
    }
}

export const adjustPost = async (req, res) => {
    try {
        const currentUserId = req.decoded.id
        const postId = req.params.id

        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (String(post.authorId) !== String(currentUserId)) {
            return res.status(401).json({ success: false, message: 'controller/adjustPost: you can only update your post' })
        }

        const { caption, mediaUrl, mediaType } = req.body //

        if (!caption && !mediaType && !mediaUrl) {
            return res.status(401).json({ success: false, message: 'controller/uploadNewPost: please atleast have a caption' })
        } else if ((!mediaType && mediaUrl) || (mediaType && !mediaUrl)) {
            return res.status(401).json({ success: false, message: 'controller/uploadNewPost: please specify mediaUrl && mediaType' })
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $set: { caption, mediaUrl, mediaType } },
            { new: true }
        )

        if (!updatedPost) {
            return res.status(401).json({ success: false, message: 'controller/adjustPost: updatedPost not found' })
        }

        res.status(200).json({ success: true, message: 'post updated successfully', updatedPost })
    } catch (err) {
        res.status(400).json({ success: false, message: `controller/uploadNewPost: ${err.message}` })
    }
}

export const deletePost = async (req, res) => {
    try {
        const currentUserId = req.decoded.id
        const postId = req.params.id

        const post = await Post.findById(postId)
        if (!post) {
            return res.status(401).json({ success: false, message: 'controller/adjustPost: post not found' })
        }
        if (String(currentUserId) !== String(post.authorId)) {
            return res.status(401).json({ success: false, message: 'controller/adjustPost: you can only delete your post' })
        }

        await Post.findByIdAndDelete(postId)

        res.status(200).json({ success: true, message: 'post deleted successfully' })
    } catch (e) {
        res.status(400).json({ success: false, message: `controller/uploadNewPost: ${err.message}` })
    }
}

export const likePost = async (req, res) => {
    try {
        const currentUserId = req.decoded.id
        const postId = req.params.id

        const post = await Post.findById(postId)
        if (!post) {
            return res.status(401).json({ success: false, message: "controller/likePost: post not found" })
        }

        if (!post.likes.includes(currentUserId)) {
            const updatedPost = await Post.findByIdAndUpdate(
                postId,
                {
                    $inc: { likeCount: 1 },
                    $addToSet: { likes: currentUserId }
                },
                { new: true }
            )
            return res.status(200).json({ success: true, message: 'like post successfully', updatedPost })
        }

        res.status(200).json({ success: true, message: 'already liked' })
    } catch (err) {
        res.status(400).json({ success: false, message: `controller/likePost: ${err.message}` })
    }
}

export const unlikePost = async (req, res) => {
    try {
        const currentUserId = req.decoded.id
        const postId = req.params.id

        const post = await Post.findById(postId)
        if (!post) {
            return res.status(401).json({ success: false, message: "controller/unlikePost: post not found" })
        }

        if (post.likes.includes(currentUserId)) {
            const updatedPost = await Post.findByIdAndUpdate(
                postId,
                {
                    $inc: { likeCount: -1 },
                    $pull: { likes: currentUserId }
                },
                { new: true }
            )
            return res.status(200).json({ success: true, message: 'unlike post successfully', updatedPost })
        }

        res.status(200).json({ success: true, message: 'already unliked' })
    } catch (err) {
        res.status(400).json({ success: false, message: `controller/unlikePost: ${err.message}` })
    }
}

export const sharePost = async (req, res) => {
    try {
        const currentUserId = req.decoded.id
        const sharedPostId = req.params.id

        if (!(await Post.findById(sharedPostId))) {
            return res.status(402).json({ success: false, message: "controller/sharePost: original post not found" })
        }

        const { caption, mediaUrl, mediaType } = req.body //

        if (!caption && !mediaType && !mediaUrl) {
            return res.status(401).json({ success: false, message: 'controller/sharePost: please atleast have a caption' })
        } else if ((!mediaType && mediaUrl) || (mediaType && !mediaUrl)) {
            return res.status(401).json({ success: false, message: 'controller/sharePost: please specify mediaUrl && mediaType' })
        }

        const newPost = await Post.create({
            authorId: currentUserId,
            caption,
            mediaType,
            mediaUrl,
            isShared: true,
            originalPost: sharedPostId
        })
        if (!newPost) {
            return res.status(401).json({ success: false, message: 'controller/sharePost: cant create new post' })
        }

        res.status(200).json({ success: true, message: 'post shared successfully', newPost })
    } catch (e) {
        res.status(400).json({ success: true, message: `controller/sharePost: ${e.message}` })
    }
}