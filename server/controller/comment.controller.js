import cloudinary from "../lib/cloudinary.js";
import Comment from "../model/comment.model.js";
import Post from "../model/post.model.js";
import { Audio } from "../model/audio.model.js";

export const uploadComment = async (req, res) => {
    try {
        const currentUserId = req.decoded.id
        const refId = req.params.id
        const { text, media } = req.body //media = [{mediaType, mediaPreview},...]

        const entity = await Post.findById(refId) || await Audio.findById(refId)

        if (!text && media.length == 0) {
            return res.status(401).json({ success: false, message: 'controller/uploadComment: please at least have a caption' })
        }

        let mediaUrls = []
        if (media.length > 0) {
            mediaUrls = await Promise.all(
                media.map(async (item) => {
                    const uploadRes = await cloudinary.uploader.upload(item.preview)
                    return { mediaUrl: uploadRes.secure_url, mediaType: item.type }
                })
            )
        }

        const newComment = await Comment.create({
            refId,
            commentor: currentUserId,
            text,
            media: mediaUrls
        })

        if (!newComment) {
            return res.status(403).json({ success: false, message: 'controller/uploadComment: can not upload comment' })
        }

        entity.commentCount += 1
        await entity.save()

        res.status(200).json({ successL: true, message: "upload comment successfully", newComment })
    } catch (e) {
        console.log(e.message)
        res.status(400).json({ success: false, message: `controller/uploadComment: ${e.message}` })
    }
}

export const uploadCommentAudio = async (req, res) => {
        try {
        const currentUserId = req.decoded.id
        const audioId = req.params.id
        const { text, media } = req.body //media = [{mediaType, mediaPreview},...]

        if (!audioId) {
            return res.status(403).json({ success: false, message: 'controller/uploadComment: post not found' })
        }
        
        const audio = await Audio.findById(audioId)

        if (!text && media.length == 0) {
            return res.status(401).json({ success: false, message: 'controller/uploadComment: please at least have a caption' })
        }

        let mediaUrls = []
        if (media.length > 0) {
            mediaUrls = await Promise.all(
                media.map(async (item) => {
                    const uploadRes = await cloudinary.uploader.upload(item.preview)
                    return { mediaUrl: uploadRes.secure_url, mediaType: item.type }
                })
            )
        }

        const newComment = await Comment.create({
            audioId,
            commentor: currentUserId,
            text,
            media: mediaUrls
        })

        audio.commentCount += 1
        await audio.save()

        res.status(200).json({ successL: true, message: "upload comment successfully", newComment })
    } catch (e) {
        res.status(400).json({ success: false, message: `controller/uploadComment: ${e.message}` })
    }
}

export const deleteComment = async (req, res) => {
    try {
        const currentUserId = req.decoded.id
        const commentId = req.params.id

        const comment = await Comment.findById(commentId)

        const post = await Post.findById(comment.postId)
        if (!post) {
            return res.status(401).json({ success: false, message: "controller/deleteComment: post not found" })
        }

        if (!comment) {
            return res.status(401).json({ success: false, message: "controller/deleteComment: comment not found" })
        }

        if (String(currentUserId) !== String(comment.commentorId)) {
            return res.status(402).json({ success: false, message: "controller/deleteComment: you cant delete others' comments" })
        }

        await Comment.findByIdAndDelete(commentId)

        post.commentCount -= 1
        await post.save()

        res.status(200).json({ success: true, message: "comment deleted successfully" })
    } catch (e) {
        res.status(400).json({ success: false, message: `controller/deleteComment: ${e.message}` })
    }
}

export const updateComment = async (req, res) => {
    try {
        const currentUserId = req.decoded.id
        const commentId = req.params.id
        const { text, mediaUrl, mediaType } = req.body

        if (!text && !mediaType && !mediaUrl) {
            return res.status(401).json({ success: false, message: 'controller/updateComment: please atleast have a caption' })
        } else if ((!mediaType && mediaUrl) || (mediaType && !mediaUrl)) {
            return res.status(402).json({ success: false, message: 'controller/updateComment: please specify mediaUrl && mediaType' })
        }

        const comment = await Comment.findById(commentId)
        if (!comment) {
            return res.status(401).json({ success: false, message: "controller/updateComment: comment not found" })
        } else if (String(currentUserId) !== String(comment.commentorId)) {
            return res.status(402).json({ success: false, message: "controller/updateComment: you cant update others' comments" })
        }

        const newComment = await Comment.findByIdAndUpdate(
            commentId,
            { $set: { text, mediaType, mediaUrl } },
            { new: true }
        )

        if (!newComment) {
            return res.status(403).json({ success: false, message: 'controller/updateComment: can not update comment' })
        }

        res.status(200).json({ successL: true, message: "upload comment successfully", newComment })
    } catch (e) {
        res.status(400).json({ success: false, message: `controller/updateComment: ${e.message}` })
    }
}

export const getComment = async (req, res) => {
    try {
        const commentId = req.params.id
        const comment = await Comment.findById(commentId)

        if (!comment) {
            return res.status(401).json({ success: false, message: "controller/getComment: comment not found" })
        }

        res.status(200).json({ success: true, message: "get comment successfully", comment })
    } catch {
        res.status(400).json({ success: false, message: `controller/getComment: ${e.message}` })
    }
}

export const getComments = async (req, res) => {
    try {
        const refId = req.params.id 
        const comments = await Comment.find({ refId }).populate('commentor', 'avatar username')

        res.status(200).json({ success: true, message: "get comments by post successfully", comments })
    } catch (e) {
        res.status(400).json({ success: false, message: `controller/getCommentsByPost: ${e.message}` })
    }
}

export const likeComment = async (req, res) => {
    try {
        const commentId = req.params.id
        const currentUserId = req.decoded.id

        const comment = await Comment.findById(commentId)

        if (!comment) {
            return res.status(401).json({ success: false, message: "controller/likeComment: comment not found" })
        } else if (comment.likedBy.includes(currentUserId)) {
            return res.status(401).json({ success: false, message: "controller/likeComment: you already liked this" })
        }

        comment.likedBy.push(currentUserId)
        comment.likeCount += 1

        await comment.save()

        res.status(200).json({ success: true, message: "like comment successfully", comment })
    } catch (e) {
        res.status(400).json({ success: false, message: `controller/likeComment: ${e.message}` })
    }
}

export const unlikeComment = async (req, res) => {
    try {
        const commentId = req.params.id
        const currentUserId = req.decoded.id

        const comment = await Comment.findById(commentId)

        if (!comment) {
            return res.status(401).json({ success: false, message: "controller/unlikeComment: comment not found" })
        } else if (!comment.likedBy.includes(currentUserId)) {
            return res.status(401).json({ success: false, message: "controller/unlikeComment: you already unliked this" })
        }

        const indexOfUser = comment.likedBy.indexOf(currentUserId)
        comment.likedBy.splice(indexOfUser, 1)
        comment.likeCount -= 1

        await comment.save()

        res.status(200).json({ success: true, message: "unlike comment successfully", comment })
    } catch (e) {
        res.status(400).json({ success: false, message: `controller/unlikeComment: ${e.message}` })
    }
}