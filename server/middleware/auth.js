const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token')
    if(!token) {
        return res.status(401).json({ message: 'No Token provided, authorization denied' })
    }
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'))
        // We are attaching user while generating the token
        req.username = decoded.username
        next()
    } catch(err) {
        return res.status(500).json({ msg: 'Token is not valid' })
    }
}