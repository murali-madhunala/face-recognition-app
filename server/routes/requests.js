const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const path = require('path');
const uuid = require('uuid')

router.post('/upload', [auth], async (req,res) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('Please upload an image.');
    }

    const { files } = req.files
    const { annotation } = req.body
    fileExtention = path.extname(files.name).toLowerCase()
    const facesCount = await faceApiService.detectFaces(files.data);
    if ( ['.png', '.jpg', '.jpeg', ].includes(fileExtention) ) {
        image_uuid = uuid.v4()
        const filepath = path.join(__dirname, "../", "/uploads/", req.username, "/", image_uuid + fileExtention);
        files.mv(filepath, (err)=> {
            if (err) {
                return res.status(500).send(err);
            }
            if(!GlobalUserData[req.username]) GlobalUserData[req.username] = {}

            GlobalUserData[req.username][image_uuid] = {
                imageName: path.join(image_uuid + fileExtention),
                imagePath: path.join(req.username, "/", image_uuid + fileExtention),
                facesCount: facesCount,
                annotation: annotation
            }

            return res.send({
                status: "successfully uploaded",
                imagePath: GlobalUserData[req.username][image_uuid]['imagePath'],
                facesCount: GlobalUserData[req.username][image_uuid]['facesCount'],
                annotation: GlobalUserData[req.username][image_uuid]['annotation']
            });
        });
    } else {
        res
        .status(403)
        .contentType("text/plain")
        .end("Only .png files are allowed!");
    }
})

module.exports = router
