const express = require('express')
var cors = require('cors')
const app = express()

app.use(cors());
app.get('/', (req, res) => res.send('API Running'))

// Init middlewares
app.use(express.json({ extended: false }))

global.GlobalUserData = {}
// Define routes


const PORT = process.env.PORT || 5001

app.listen(PORT, () => console.log(`Server started on ${PORT}....`))