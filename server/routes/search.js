import express from 'express'
import verifyAccessToken from '../middleware/auth.middleware.js'
import User from '../model/user.model.js'
import Post from '../model/post.model.js'

const router = express.Router()

router.get('/:query',verifyAccessToken, async (req, res) => {
    try {
        const query = req.params.query

        if (!query) {
            return res.status(401).json({success: false, message: 'query empty'})
        }
        const regex = new RegExp(query, 'i')

        const users = await User.find({username: regex}).select('-password')
        const posts = await Post.find({caption: regex})

        res.status(200).json({success: true, message:'search successfuly', users, posts})
    } catch(e) {
        res.status(400).json({success: false, message: e.message})
    }
})

export default router