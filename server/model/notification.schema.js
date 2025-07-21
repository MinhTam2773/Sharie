import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ['like', 'comment', 'follow', 'message', 'share', 'post']
    },
    message: {
        type: String,
        required: true,
        default:''
    },
    isRead: {
        type: Boolean,
        default:false,
    }
}, { timestamp: true})

const Notification = mongoose.model('Notification', notificationSchema)
export default Notification