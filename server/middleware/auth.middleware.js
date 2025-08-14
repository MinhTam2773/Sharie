import jwt from 'jsonwebtoken'

const verifyAccessToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        const token = authHeader?.split(' ')[1] //authHeaders = Bearer [accessToken]

        if (!token) {
            return res.status(401).json({success: false, message:'middleware: invalid or no access token found in header'})
        }
        
        jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, decoded) => {
            if (err) return res.status(401).json({success: false, message:'middleware: Invalid or expired access token'})
            
            req.decoded = decoded //{id:user._id}
            next()
        })
    } catch(err) {
        res.status(401).json({success: false, message: `middleware: ${err.message}`})
    }
}

export default verifyAccessToken