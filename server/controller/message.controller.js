import Chat from "../model/chat.model.js";
import Message from "../model/message.model.js";
import cloudinary from "../lib/cloudinary.js"
import { sendNotification } from "../lib/utils.js";

export const startMessage = async (req, res) => {
    try {
        const currentUserId = req.decoded.id
        const { userId, text, mediaType, media } = req.body

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


        const message = await Message.create({
            text,
            mediaType,
            mediaUrl,
            sender: currentUserId,
            chatId: chat._id
        })

        chat.lastMessage = message._id
        await chat.save()

        res.status(200).json({ success: true, message: "start chat successfully", chatId: chat._id })
    } catch (e) {
        res.status(400).json({ success: false, message: `controller/startMessage: ${e.message}` })
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

        const chat = await Chat.findById(chatId)

        if (!chat) {
            return res.status(403).json({ success: false, message: 'controller/sendMessage: chat not found' })
        }

        const message = await Message.create({
            text,
            mediaType,
            mediaUrl,
            sender: currentUserId,
            chatId: chat._id
        })

        chat.lastMessage = message._id
        await chat.save()

        res.status(200).json({ success: true, message: "send message successfully", messageSent: message.text, sender: currentUserId, participants: chat.participants })
    } catch (e) {
        res.status(400).json({ success: false, message: `controller/sendMessage: ${e.message}` })
    }
}

export const getMessages = async (req, res) => {
    try {
        const chatId = req.params.id

        const messages = Message.find({ chatId })
        if (!messages) {
            return res.status(401).json({ success: false, message: 'controller/getMessages: chat not found, or not created yet' })
        }

        res.status(200).json({ success: true, message: 'get chat successfully', messages })
    } catch (e) {
        res.status(400).json({ success: false, message: `controller/getMessages: ${e.message}` })
    }
}

export const deleteMessage = async (req, res) => {
    try {
        const {messageId} = req.params.id
        const currentUserId = req.decoded.id

        const message = Message.findById(messageId)
        if (!message) {
            return res.status(401).json({success: false, message: "controller/deleteMessages: message not found"})
        } else if (String(message.sender) === String(currentUserId)) {
            return res.status(402).json({success: false, message: "controller/deleteMessages: you can only delete your own message"})
        }

        await Message.findByIdAndDelete(messageId)

        res.status(200).json({success: true, message: "message deleted successfully"})        
    } catch(e) { 
        res.status(400).json({ success: false, message: `controller/deleteMessages: ${e.message}` })
    }
}

export const likeMessage = async (req, res) => {
    try {

    } catch(e) {
        res.status(400).json({success: false, message: `controller/likeMessage: ${e.message}`})
    }
}