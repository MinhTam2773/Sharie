import express from 'express'
import { adjustPost, deletePost, getPost, getPostsFromFollowing,getRepostsFromUser, getPostsFromUser, likePost, repostPost, sharePost, unlikePost, unRepost, uploadNewPost } from '../controller/post.controller.js'
import verifyAccessToken from '../middleware/auth.middleware.js'
import { getComments } from '../controller/comment.controller.js'

const router = express.Router()

router.get('/:id', verifyAccessToken, getPost)
router.get('/', verifyAccessToken, getPostsFromFollowing)
router.get('/profile/:id', verifyAccessToken, getPostsFromUser)
router.get('/profile/reposts/:id', verifyAccessToken, getRepostsFromUser)
router.post('/upload', verifyAccessToken, uploadNewPost)
router.put('/adjust/:id', verifyAccessToken, adjustPost)
router.delete('/delete/:id', verifyAccessToken, deletePost)
router.post('/like/:id', verifyAccessToken, likePost)
router.post('/unlike/:id', verifyAccessToken, unlikePost)
router.post('/share/:id', verifyAccessToken, sharePost)
router.get('/:id/comments', verifyAccessToken, getComments)
router.post('/repost/:id', verifyAccessToken, repostPost)
router.delete('/unrepost/:id', verifyAccessToken, unRepost)

export default router