import express from 'express'
import { signin, login, generateNewAccessToken, logout } from '../controller/auth.controller.js'


const router =  express.Router()

router.post('/signin', signin)
router.post('/login', login)
router.post('/refresh', generateNewAccessToken)
router.post('/logout', logout)

export default router