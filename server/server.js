const express = require('express')
var cors = require('cors')
const expressUploader = require("express-fileupload")
const app = express()

app.use(cors());

// Init middlewares
app.use(express.json({ extended: false }))
app.use(expressUploader({createParentPath: true}))
app.use('/static', express.static('uploads'))

global.GlobalUserData = {}
// Define routes
app.get('/', (req, res) => res.send('API Running'))
app.use('/api/generateToken', require('./routes/generateToken'))
app.use('/api/requests', require('./routes/requests'))


const PORT = process.env.PORT || 5001

app.listen(PORT, () => console.log(`Server started on ${PORT}....`))