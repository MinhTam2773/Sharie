import {getReceiverSocketId, io, } from './socket.js'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import htmlTemplate from './htmlTemplate.js'

dotenv.config()

export const sendNotification = async (receiverId, senderId = null, type, message, isRead = false) => {
    try{
        const notification = await Notification.create({
            receiverId, senderId, type, message, isRead
        })

        const receiverSocketId = getReceiverSocketId(receiverId)
        io.to(receiverSocketId).emit('newNotification', notification)
    } catch(e) {
        console.error('sendNotification:', e.message)
    }
}

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
})

export const sendEmail = async (to , code) => {
    const html = htmlTemplate.replace('{{CODE}}', code)

    try {
        await transporter.sendMail({
            from: `"Sharie" <${process.env.EMAIL}>`,
            to,
            subject: 'Your verication code',
            html
        })
        return {success: true, message: 'code sent successfully'}
    } catch (e) {
        return {success: false, message: `utils/sendEmail: ${e.message}`}
    }
}