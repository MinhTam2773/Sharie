import express from 'express'
import verifyAccessToken from '../middleware/auth.middleware.js'
import { uploadAudio, getAudios, likeAudio, unlikeAudio, shareAudio, deleteAudio } from '../controller/audio.controller.js'
import multer from "multer"

const storage = multer.memoryStorage()
const upload = multer({ storage })

const router = express.Router()

router.post(
    '/upload/:id',
    verifyAccessToken,
    upload.fields([
        { name: 'audio', maxCount: 1 },
        { name: 'coverImage', maxCount: 1 }
    ]),
    uploadAudio)

router.get('/', getAudios)
router.put('/like/:id', verifyAccessToken, likeAudio)
router.put('/unlike/:id', verifyAccessToken, unlikeAudio)
router.post('/share/:id', verifyAccessToken, shareAudio)
router.delete('/delete/:id', verifyAccessToken, deleteAudio)


export default router