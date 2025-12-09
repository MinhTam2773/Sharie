import { Collection } from "../model/collection.model.js"
import cloudinary from "../lib/cloudinary.js"
import { Audio } from "../model/audio.model.js"
import { Readable } from 'stream'
import ffmpeg from "fluent-ffmpeg"
import ffmpegPath from "ffmpeg-static"

ffmpeg.setFfmpegPath(ffmpegPath)

export const uploadAudio = async (req, res) => {
    try {
        const { title, duration, start, end, collectionName } = req.body
        const userId = req.decoded.id
        const collectionId = req.params.id

        console.log(collectionId)

        if (!title || !duration) throw new Error('please fill all fields')

        //convert buffer to stream for ffmpeg
        const audioBuffer = req.files.audio[0].buffer
        const audioStream = Readable.from(audioBuffer)

        //trim audio with ffmpeg
        const trimmedBuffer = await new Promise((resolve, reject) => {
            const chunks = []
            ffmpeg(audioStream)
                .setStartTime(start)
                .setDuration(end - start)
                .format("mp3")
                .on("error", (err) => reject(err))
                .on("end", () => resolve(Buffer.concat(chunks)))
                .pipe()
                .on("data", (chunk) => chunks.push(chunk))
        })

        //upload trimmed audio to cloudinary
        const audioUpload = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { resource_type: 'video', folder: 'audios' },
                (err, result) => {
                    if (err) return reject(err)
                    return resolve(result)
                }
            ).end(trimmedBuffer)
        })

        //upload cover Image to cloudinary
        const coverImageUpload = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { resource_type: 'image', folder: 'covers' },
                (err, result) => {
                    if (err) return reject(err)
                    return resolve(result)
                }
            ).end(req.files.coverImage[0].buffer)
        })

        const newAudio = await Audio.create({
            title,
            uploadedBy: userId,
            sourceType: 'upload',
            fileUrl: audioUpload.secure_url,
            fileId: audioUpload.public_id,
            duration: (end - start),
            coverImage: coverImageUpload.secure_url,
            coverImageId: coverImageUpload.public_id,
            tags: []
        })

        if (collectionId) {
            await Collection.findByIdAndUpdate(
                collectionId,
                { $addToSet: { audios: newAudio._id } }
            )
        } else {
            await Collection.create({
                name: collectionName,
                owner: userId,
                audios: [newAudio._id],
                coverImage: newAudio.coverImage
            })
        }

        res.status(200).json({ message: 'new audio created', audio: newAudio })
    } catch (e) {
        console.log(e.message)
        res.status(400)
    }
}

export const getAudios = async (req, res) => {
    try {
        const audios = await Audio.find()
        .populate([
            { path: 'uploadedBy', select: 'avatar username nickname' },
            {
                path: 'originalAudio',
                populate: {
                    path: 'uploadedBy',
                    model: 'User',
                    select: '-password -email -__v -createdAt -updatedAt'
                }
            }])

        res.status(200).json({ success: true, message: 'get audios successfully', audios })
    } catch (err) {
        console.log(err.message)
        res.status(400).json({ success: false, message: 'ngu lon' })
    }
}

export const likeAudio = async (req, res) => {
    try {
        const audioId = req.params.id
        const currentUserId = req.decoded.id

        if (!audioId) throw new Error('audio Id not found')

        const audio = await Audio.findByIdAndUpdate(
            audioId,
            {
                $addToSet: { likes: currentUserId }
            },
            { new: true }
        ).populate('uploadedBy', 'username avatar nickname')

        res.status(200).json({ success: true, message: 'like audio successfully', audio })
    } catch (e) {
        console.log(e.message)
        res.status(400).json({ success: false, message: e.message })
    }
}
export const unlikeAudio = async (req, res) => {
    try {
        const audioId = req.params.id
        const currentUserId = req.decoded.id

        if (!audioId) throw new Error('audio Id not found')

        const audio = await Audio.findByIdAndUpdate(
            audioId,
            {
                $pull: { likes: currentUserId }
            },
            { new: true }
        )

        res.status(200).json({ success: true, message: 'UNLIKE audio successfully', audio })
    } catch (e) {
        console.log(e.message)
        res.status(400).json({ success: false, message: e.message })
    }
}

export const shareAudio = async (req, res) => {
    try {
        const audioId = req.params.id
        const userId = req.decoded.id
        const collectionId = req.query.collectionId
        if (!audioId) throw new Error('audio Id not found')

        console.log(audioId)
        const originalAudio = await Audio.findById(audioId)
        if (!originalAudio) throw new Error('original audio not found')

        let newAudio = await Audio.create({
            uploadedBy: userId,
            sourceType: 'shared',
            isShared: true,
            originalAudio: audioId
        })

        newAudio = await newAudio.populate([
            { path: 'uploadedBy', select: 'avatar username nickname' },
            {
                path: 'originalAudio',
                populate: {
                    path: 'uploadedBy',
                    model: 'User',
                    select: '-password -email -__v -createdAt -updatedAt'
                }
            }])

        originalAudio.shares.push(userId)
        await originalAudio.save()

        await Collection.findByIdAndUpdate(
            collectionId,
            {
                $addToSet: { audio: newAudio._id }
            }
        )

        return res.status(200).json({ success: true, message: 'share audio successfully', newAudio })
    } catch (e) {
        console.log(e.message)
        res.status(400).json({ success: false, message: e.message })
    }
}

export const deleteAudio = async (req, res) => {
        try{
            const audioId = req.params.id
            if(!audioId) throw new Error('audio Id not found')

            const audio = await Audio.findById(audioId)

            if (audio.fileId) {
                await cloudinary.uploader.destroy(audio.fileId, {resource_type:'video'})
            }

            if (audio.coverImageId) {
                await cloudinary.uploader.destroy(audio.coverImageId)
            }

            await audio.deleteOne()

            return res.status(200).json({success: true, message: 'delete audio successfully'})
        } catch(e) {
            console.log(e.message)
            
        }
    }