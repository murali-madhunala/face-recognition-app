const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')

router.post('/', [
    check('username', 'username is required')
], async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { username } = req.body
    if(!username){
        return res.status(400).send({ message: "Please provide a username" })
    }
    if(!GlobalUserData[username]) GlobalUserData[username] = {}

    try {
        const payload = {
            username: username
        }
        jwt.sign(payload,
            config.get('jwtSecret'),
            {expiresIn: 1800},
            (err, token)=>{
                if(err) throw err;
                res.json({token, expiresIn: "30 minutes" })
        })
    } catch(error) {
        console.log(error.message);
        return res.status(500).send({ message: 'Server error: ' + error.message })
    }
})


module.exports = router
