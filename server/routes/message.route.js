import express from 'express'
import verifyAccessToken from '../middleware/auth.middleware.js'
import { adjustMessage, deleteMessage, getMessages, sendMessage, startMessage } from '../controller/message.controller.js'

const router = express.Router()

router.post('/:id/send-message', verifyAccessToken, sendMessage) //chatId
router.get('/:id', verifyAccessToken, getMessages) //chatId
router.delete('/:id', verifyAccessToken, deleteMessage) //messageId
router.post('/:id/start-message', verifyAccessToken, startMessage)
router.put('/adjust/:id', verifyAccessToken, adjustMessage)

export default router