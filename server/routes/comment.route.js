import express from 'express'
import { deleteComment, getComment, likeComment, unlikeComment, updateComment, uploadComment } from '../controller/comment.controller.js'
import verifyAccessToken from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/:id/upload', verifyAccessToken, uploadComment)
router.delete('/delete/:id', verifyAccessToken, deleteComment)
router.put('/update/:id', verifyAccessToken, updateComment)
router.get('/:id', verifyAccessToken, getComment)
router.put('/like/:id', verifyAccessToken, likeComment)
router.put('/unlike/:id', verifyAccessToken, unlikeComment)

export default router