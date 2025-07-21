import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        default: null
    },
    mediaUrl: {
        type: String,
        default: null
    }, 
    mediaType: {
        type: String,
        default: null
    },
    seenBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true})

const Message = mongoose.model('Message', messageSchema)
export default Message