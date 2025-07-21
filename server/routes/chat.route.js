import express from 'express'
import verifyAccessToken from '../middleware/auth.middleware.js'
import { createGroupChat, getChat } from '../controller/chat.controller.js'
import { startMessage } from '../controller/message.controller.js'

const router = express.Router()

router.post('/create/groupchat', verifyAccessToken, createGroupChat)
router.get('/:id', getChat)
router.post('/start', verifyAccessToken, startMessage)

export default router