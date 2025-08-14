import User from "../model/user.model.js";

export const getCurrentUser = async (req, res) => {
    try {
        const id = req.decoded.id //get decoded from middleware
        const user = await User.findById(id)
        if (!user) {
            return res.status(400).json({ success: false, message: 'getCurrentUser: invalid id stored inside token' })
        }

        res.status(200).json({ success: true, message: 'get current user successfully', user })
    } catch (err) {
        res.status(400).json({ success: false, message: `getCurrentUser: ${err.message}` })
    }
}

export const getTargetUser = async (req, res) => {
    try {
        const targetUserName = req.params.username
        const currentUserId = req.decoded.id

        const user = await User.findOne({ username: targetUserName })
        if (!user) {
            return res.status(401).json({ success: false, message: "controller/getTargetUser: target user not found" })
        }

        const isFollowing = user.followers.includes(currentUserId)

        res.status(200).json({ success: true, message: 'get current user successfully', user, isFollowing })
    } catch (err) {
        res.status(400).json({ success: false, message: `controller/getTargetUser: ${err.message}` })
    }
}

export const updateCurrentUser = async (req, res) => {
    try {
        const id = req.decoded.id
        const updates = req.body

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-refreshToken') // optional: exclude token from response

        if (!updatedUser) {
            return res.status(401).json({ success: false, message: `controller/updateCurrentUser: can not update user` })
        }

        res.status(200).json({ success: true, updatedUser, message: "Update user successfully" })
    } catch (err) {
        res.status(400).json({ success: false, message: `controller/updateCurrentUser: ${err.message}` })
    }
}

export const follow = async (req, res) => {
    try {
        //url = "/api/users/follow/:id"
        const targetUserId = req.params.id
        const currentUserId = req.decoded.id //get id through middleware

        if (targetUserId === currentUserId) {
            return res.status(401).json({ success: false, message: 'controller/follow: you cant follow yourself' })
        }

        await User.findByIdAndUpdate(currentUserId, {
            $addToSet: { following: targetUserId }
        })
        await User.findByIdAndUpdate(targetUserId, {
            $addToSet: { followers: currentUserId }
        })

        res.status(200).json({ success: true, message: 'Follow successfully' })
    } catch (err) {
        res.status(400).json({ success: false, message: `follow: ${err.message} ` })
    }
}

export const unfollow = async (req, res) => {
    try {
        //url = "/api/users/follow/:id"
        const targetUserId = req.params.id
        const currentUserId = req.decoded.id //get id through middleware

        if (targetUserId === currentUserId) {
            return res.status(401).json({ success: false, message: 'controller/follow: you cant unfollow yourself' })
        }

        await User.findByIdAndUpdate(currentUserId, {
            $pull: { following: targetUserId }
        })
        await User.findByIdAndUpdate(targetUserId, {
            $pull: { followers: currentUserId }
        })

        res.status(200).json({ success: true, message: "unfollow successfully" })
    } catch (err) {
        res.status(400).json({ success: false, message: `${err.message}` })
    }
}