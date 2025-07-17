import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { connectDB } from './db/db.js'
import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.route.js'
import postRouter from './routes/post.route.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

//middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173', //MUST CHANGE WHEN DEVELOP FRONTEND
    credentials: true //allow sending cookies
}))

//routes
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/posts', postRouter)

//db
app.listen(PORT, () => {
    connectDB()
    console.log('connected at http://localhost:' + PORT)
})
