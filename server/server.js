import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { connectDB } from './db/db.js'
import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.route.js'
import postRouter from './routes/post.route.js'
import commentRouter from './routes/comment.route.js'
import chatRouter from './routes/chat.route.js'
import messageRouter from './routes/message.route.js'
import searchRouter from './routes/search.js'
import { app, io, server } from './lib/socket.js'

dotenv.config()
const PORT = process.env.PORT || 5000

//middleware
app.use(express.json({ limit: '25mb'}))
app.use(express.urlencoded({limit: '25mb', extended: true}))
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173', //MUST CHANGE WHEN DEVELOP FRONTEND
    credentials: true //allow sending cookies
}))

//routes
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/posts', postRouter)
app.use('/api/comments', commentRouter)
app.use('/api/chats', chatRouter)
app.use('/api/messages', messageRouter)
app.use('/api/search', searchRouter)

//db
server.listen(PORT, () => {
    connectDB()
    console.log('connected at http://localhost:' + PORT)
})
