import { Collection } from "../model/collection.model.js"

export const createCollection = async () => {
    const {name, description} = req.body
    const userId = req.decoded.userId
    const collection =  await Collection.create({

    })
}

export const getCollectionsByUser = async (req, res) => {
    try {
        const userId = req.params.id

        if (!userId) throw new Error('user Id is empty')

        const collections = await Collection.find({owner: userId})

        return res.status(200).json({success: true, collections, message: 'get collections successfully'})
    } catch(err) {
        console.log(err.message)
        res.status(400).json({success: false, message: err.message})
    }
}