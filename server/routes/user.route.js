import express from 'express'
import { follow,unfollow, getCurrentUser, getFollowStatus, getTargetUser, updateCurrentUser } from '../controller/user.controller.js'
import verifyAccessToken from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/me', verifyAccessToken , getCurrentUser)
router.post('/follow/:id', verifyAccessToken, follow)
router.delete('/unfollow/:id', verifyAccessToken, unfollow)
router.post('/getfollowstatus/:id', verifyAccessToken, getFollowStatus)
router.get('/:id', verifyAccessToken, getTargetUser)
router.put('/me', verifyAccessToken, updateCurrentUser)

export default router