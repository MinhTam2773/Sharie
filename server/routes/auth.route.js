import express from 'express'
import { signin, login, generateNewAccessToken, logout, sendVerifyCode, verifyCode, checkExistingAccount } from '../controller/auth.controller.js'


const router =  express.Router()

router.post('/checkUser', checkExistingAccount)
router.post('/sendCode', sendVerifyCode)
router.post('/verifyCode', verifyCode)
router.post('/signin', signin)
router.post('/login', login)
router.post('/refresh', generateNewAccessToken)
router.post('/logout', logout)

export default router