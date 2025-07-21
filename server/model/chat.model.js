import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    nicknames: {
        //await Chat.findByIdAndUpdate(chatId, {
        //   [`nicknames.${userId}`]: 'Funny Tam'
        //})
        //chat.nicknames.set(userId.toString(), "Tam the Coder")

        type: Map,
        of: String,
        default: {}
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    isGroup: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        trim: true
    },
    admin: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true })

const Chat = mongoose.model('Chat', chatSchema)
export default Chat