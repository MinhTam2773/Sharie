import express from 'express'
import { adjustPost, deletePost, getPost, getPostsFromFollowing, getPostsFromUser, likePost, sharePost, unlikePost, uploadNewPost } from '../controller/post.controller.js'
import verifyAccessToken from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/:id', verifyAccessToken, getPost)
router.get('/', verifyAccessToken, getPostsFromFollowing)
router.get('/profile/:id', verifyAccessToken, getPostsFromUser)
router.post('/upload', verifyAccessToken, uploadNewPost)
router.put('/adjust/:id', verifyAccessToken, adjustPost)
router.delete('/delete/:id', verifyAccessToken, deletePost)
router.post('/like/:id', verifyAccessToken, likePost)
router.post('/unlike/:id', verifyAccessToken, unlikePost)
router.post('/share/:id', verifyAccessToken, sharePost)

export default router