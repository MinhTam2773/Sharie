import User from "../model/user.model.js";

export const getCurrentUser = async (req, res) => {
    try {
        const id = req.decoded.id //get decoded from middleware
        const user = await User.findById(id)
        if (!user) {
            return res.status(401).json({ success: false, message: 'getCurrentUser: invalid id stored inside token' })
        }

        res.status(200).json({ success: true, message: 'get current user successfully', user })
    } catch (err) {
        res.status(400).json({ success: false, message: `getCurrentUser: ${err.message}` })
    }
}

export const getTargetUser = async (req, res) => {
    try {
        const targetUserId = req.params.id
        const user = await User.findById(targetUserId)
        if (!user) {
            return res.status(401).json({success: false, message: "controller/getTargetUser: target user not found"})
        }

        res.status(200).json({ success: true, message: 'get current user successfully', user })
    } catch(err) {
        res.status(400).json({success: false, message: `controller/getTargetUser: ${err.message}`})
    }
}

export const updateCurrentUser = async (req,res) => {
    try {
        const id = req.decoded.id
        const updates = req.body

        const updatedUser = await User.findByIdAndUpdate(
            id, 
            {$set: updates},
            {new: true, runValidators: true}
        ).select('-refreshToken') // optional: exclude token from response

        if (!updatedUser){
            return res.status(401).json({success: false, message: `controller/updateCurrentUser: can not update user`})
        }

        res.status(200).json({success: true, updatedUser, message: "Update user successfully"})
    } catch(err) {
        res.status(400).json({success: false, message: `controller/updateCurrentUser: ${err.message}`})
    }
}

export const getFollowStatus = async (req, res) => {
    try {
        const targetUserId = req.params.id
        const currentUserId = req.decoded.id

        if (targetUserId === currentUserId) {
            return res.status(401).json({success: false, message:"controller/getFollowStatus: you cant follow yourself"})
        }

        const currentUser = await User.findById(currentUserId)

        if (!currentUser) {
            return res.status(401).json({ sucess: false, message: "controller/getFollowStatus: current user not found" })
        }

        const isFollowing = currentUser.following.includes(targetUserId)

        const message = isFollowing ? "you are following them" : "you are NOT following them"
        res.json({ success: true, message })
    } catch (err) {
        res.status(400).json({ success: false, message: `getFollowStatus: ${err.message}` })
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

        res.status(200).json({success: true, message: "unfollow successfully"})
    } catch (err) {
        res.status(400).json({ success: false, message: `${err.message}` })
    }
}