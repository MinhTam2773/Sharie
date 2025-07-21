import express from 'express'
import verifyAccessToken from '../middleware/auth.middleware.js'
import { deleteMessage, getMessages, sendMessage } from '../controller/message.controller.js'

const router = express.Router()

router.post('/:id/send-message', verifyAccessToken, sendMessage) //chatId
router.get('/:id', verifyAccessToken, getMessages) //chatId
router.delete('/:id', verifyAccessToken, deleteMessage) //messageId

export default router