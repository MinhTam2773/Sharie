import {getReceiverSocketId, io, } from './socket.js'

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