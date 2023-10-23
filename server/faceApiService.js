const path = require("path");

const tf = require("@tensorflow/tfjs-node");

// const faceapi = require("@vladmandic/face-api/dist/face-api.node.js");
const faceapi = require('@vladmandic/face-api')
const modelPathRoot = "./models";

async function getFacesCount(file) {
  const modelPath = path.join(__dirname, modelPathRoot);
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
  const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 });
  const decodeT = faceapi.tf.node.decodeImage(file, 3);
  const expandT = faceapi.tf.expandDims(decodeT, 0);
  const result = await faceapi.detectAllFaces(expandT, options)
  faceapi.tf.dispose([decodeT, expandT]);
    return result.length
}

module.exports = {
  detectFaces: getFacesCount,
};