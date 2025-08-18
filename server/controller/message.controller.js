import Chat from "../model/chat.model.js";
import Message from "../model/message.model.js";
import cloudinary from "../lib/cloudinary.js"
import { sendNotification } from "../lib/utils.js";
import { getReceiverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";

export const startMessage = async (req, res) => {
    try {
        const currentUserId = req.decoded.id
        const userId = req.params.id
        const { text, mediaType, media } = req.body

        if (!text && !mediaType && !media) {
            return res.status(401).json({ success: false, message: 'controller/startMessage: please atleast have a text' })
        } else if ((!mediaType && media) || (mediaType && !media)) {
            return res.status(402).json({ success: false, message: 'controller/startMessage: please specify mediaUrl && mediaType' })
        }

        let chat = await Chat.findOne({ participants: { $all: [currentUserId, userId], $size: 2 } })
        if (!chat) {
            chat = await Chat.create({ participants: [currentUserId, userId] })
        }

        let mediaUrl
        if (media) {
            const uploadRes = await cloudinary.uploader.upload(media)
            mediaUrl = uploadRes.secure_url
        }

        let newMessage = await Message.create({
            text,
            mediaType,
            mediaUrl,
            sender: currentUserId,
            chatId: chat._id
        })

        chat.lastMessage = newMessage._id
        await chat.save()

        newMessage = await newMessage.populate('sender', 'username avatar nickname')

        const receiverSocketIds = getReceiverSocketId(chat.participants)
        receiverSocketIds?.forEach((socketId) => {
            io.to(socketId).emit('newMessage', newMessage)
            console.log('new Message sent from', currentUserId)
        })

        res.status(200).json({ success: true, message: "start chat successfully", chatId: chat._id })
    } catch (e) {
        res.status(400).json({ success: false, message: `controller/startMessage: ${e.message}` })
        console.log(e.message)
    }
}

export const sendMessage = async (req, res) => {
    try {
        const currentUserId = req.decoded.id
        const chatId = req.params.id
        const { text, mediaType, media, userId } = req.body

        if (!text && !mediaType && !media) {
            return res.status(401).json({ success: false, message: 'controller/sendMessage: please atleast have a text' })
        } else if ((!mediaType && media) || (mediaType && !media)) {
            return res.status(402).json({ success: false, message: 'controller/sendMessage: please specify mediaUrl && mediaType' })
        }

        let mediaUrl
        if (media) {
            const uploadRes = await cloudinary.uploader.upload(media)
            mediaUrl = uploadRes.secure_url
        }

        let chat = await Chat.findById(chatId)

        if (!chat) {
            chat = await Chat.create({ participants: [currentUserId, userId] })
            return res.status(403).json({ success: false, message: 'controller/sendMessage: chat not found' })
        }

        let newMessage = await Message.create({
            text,
            mediaType,
            mediaUrl,
            sender: currentUserId,
            chatId: chat._id
        })

        newMessage = await newMessage.populate('sender', 'username avatar')

        chat.lastMessage = newMessage._id
        await chat.save()

        const receiverSocketIds = getReceiverSocketId(chat.participants)
        receiverSocketIds?.forEach((socketId) => {
            io.to(socketId).emit('newMessage', newMessage)
            console.log('new Message sent from', currentUserId)
        })

        res.status(200).json({ success: true, message: "send message successfully", messageSent: newMessage.text, sender: currentUserId, participants: chat.participants })
    } catch (e) {
        res.status(400).json({ success: false, message: `controller/sendMessage: ${e.message}` })
    }
}

export const getMessages = async (req, res) => {
    try {
        const chatId = req.params.id
        const { p = 0, limit = 20 } = req.query

        const messages = await Message.find({ chatId })
            .sort({ createdAt: -1 }) //newest first
            .skip(Number(p) * 20)
            .limit(Number(limit))
            .populate('sender', 'username avatar')

        if (messages.length == 0) {
            return res.status(401).json({ success: false, message: 'controller/getMessages: no messages found' })
        }

        res.status(200).json({ success: true, message: 'get chat successfully', messages: messages.reverse() })
    } catch (e) {
        res.status(400).json({ success: false, message: `controller/getMessages: ${e.message}` })
    }
}

export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params.id
        const currentUserId = req.decoded.id

        const message = await Message.findById(messageId)
        if (!message) {
            return res.status(401).json({ success: false, message: "controller/deleteMessages: message not found" })
        } else if (String(message.sender) === String(currentUserId)) {
            return res.status(402).json({ success: false, message: "controller/deleteMessages: you can only delete your own message" })
        }

        await Message.findByIdAndDelete(messageId)

        res.status(200).json({ success: true, message: "message deleted successfully" })
    } catch (e) {
        res.status(400).json({ success: false, message: `controller/deleteMessages: ${e.message}` })
    }
}

export const likeMessage = async (req, res) => {
    try {

    } catch (e) {
        res.status(400).json({ success: false, message: `controller/likeMessage: ${e.message}` })
    }
}