import Chat from "../model/chat.model.js";
import User from "../model/user.model.js"
import { sendNotification } from "../lib/utils.js";

export const createGroupChat = async (req, res) => {
    try {
        const currentUserId = req.decoded.id
        const userIds = req.body.userIds //[id1,id2]
        const groupName = req.body.name

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(401).json({ success: false, message: "controller/createChat: no users found" })
        }

        if (userIds.length === 2) {
            return res.status(402).json({ success: false, message: 'controller/createChat: can not create group chat with 1 person' })
        }

        const newGroupChat = await Chat.create({
            participants: [...userIds, currentUserId],
            isGroup: true,
            name: groupName,
            admin: currentUserId
        })
        if (!newGroupChat) {
            return res.status(403).json({ success: false, message: 'controller/createChat: can not create new group chat' })
        }

        res.status(200).json({ success: true, message: 'group create successfully' })
    } catch (e) {
        res.status(400).json({ success: false, message: `controller/createChat: ${e.message}` })
    }
}

export const getChat = async (req, res) => {
    try {
        const chatId = req.params.id

        const chat = await Chat.findById(chatId)

        if (!chat) {
            return res.status(403).json({ success: false, message: 'controller/getChat: chat not found' })
        }

        res.status(200).json({ success: true, participants: chat.participants, lastmessage: chat.lastMessage, chat })
    } catch (e) {
        res.status(400).json({ success: false, message: `controller/getChat: ${e.message}` })
    }
}

export const getChats = async (req, res) => { //ask chatgpt about this
    try {
        const currentUserId = req.decoded.id

        const chats = await Chat.find({ participants: currentUserId }).populate('participants', 'avatar username nickname').populate('lastMessage')
        if (!chats) return res.status(401).json({ success: false, message: 'controller/getChats: can not get chats from db' })

        res.status(200).json({ success: true, message: 'get chats successfully', chats })
    } catch (e) {
        res.status(400).json({ success: false, message: e.message })
    }
}

export const findChat = async (req, res) => {
    try {
        const currentUserId = req.decoded.id
        const targetUserId = req.params.id
    
        if (!targetUserId) return res.status(400).json({ success: false, message: 'controller/findChat: userId not found' })
    
        const chat = await Chat.findOne({ 
            participants: { $all: [targetUserId, currentUserId] },
            $expr: { $eq: [{ $size: "$participants" }, 2] } // exactly 2 participants
        }).populate('participants', 'username avatar nickname')
    
        if (!chat) return res.status(200).json({isExistingChat: false, message:'chat not found'})
    
        return res.status(200).json({success: true, isExistingChat: true, message:'chat found', chat})
    } catch(e) {
        console.log(e)
    }
}