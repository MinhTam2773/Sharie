import express from 'express'
import multer from 'multer'
import verifyAccessToken from '../middleware/auth.middleware.js'
import { createCollection, getCollectionsByUser } from '../controller/collection.controller.js'

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/create', verifyAccessToken, upload.single('coverImage'), createCollection)
router.get('/:id', verifyAccessToken, getCollectionsByUser) //userId

export default router