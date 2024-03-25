const jwt = require('jsonwebtoken')

// Middleware to validate token (protected routes)
const verifyToken = (req, res, next) => {
    let token = req.header('Authorization')
    if (!token) return res.status(401).json({
        error: 'JWT token not found in the headers'
    })
    try {
        token = token.replace("Bearer ", "")
        req.userData = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch (error) {
        res.status(400).json({
            error: 'Invalid JWT token'
        })
    }
}

module.exports = verifyToken;