import Chat from "../model/chat.model.js";

export const createGroupChat = async (req, res) => {
    try {
        const currentUserId = req.decoded.id
        const userIds = req.body.userIds //[id1,id2]
        const groupName = req.body.name

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(401).json({ success: false, message: "controller/createChat: no users found" })
        }

        if (userIds.length === 2) {
            return res.status(402).json({success: false, message: 'controller/createChat: can not create group chat with 1 person'})
        }

        const newGroupChat = await Chat.create({
            participants: [...userIds,currentUserId],
            isGroup: true,
            name: groupName,
            admin: currentUserId
        })
        if (!newGroupChat) {
            return res.status(403).json({success: false, message: 'controller/createChat: can not create new group chat'})
        }

        res.status(200).json({success: true, message: 'group create successfully'})
    } catch (e) {
        res.status(400).json({ success: false, message: `controller/createChat: ${e.message}` })
    }
}

export const getChat = async (req, res) => {
    try {
        const chatId = req.params.id

        const chat = await Chat.findById(chatId)

        if(!chat) {
            return res.status(403).json({success: false, message: 'controller/getChat: chat not found'})
        }


        res.status(200).json({success: true, participants: chat.participants, lastmessage: chat.lastMessage , chat})
    } catch(e) {
        res.status(400).json({success: false, message: `controller/getChat: ${e.message}`})
    }
}