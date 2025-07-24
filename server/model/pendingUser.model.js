import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // basic email regex
            },
            message: (props) => `${props.value} is not a valid email address`
        }
    },
    password: {
        type: String,
        required: true
    },
    verificationCode: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
        expires: 600 //seconds (10 minutes)
    }
})

const PendingUser = mongoose.model("PendingUser", pendingUserSchema)

export default PendingUser