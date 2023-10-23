import { Modal } from '../dialog/dialog';
import { useState } from 'react';
import './upload.css';

export const UploadFile = ({ handleImageUpload, toggleModal , closeDialog}) => {
   const [annotation, setAnnotation] = useState('');
   const [fileData, setFileData] = useState(null);

    return (
    <Modal open={toggleModal} onRequestClose={closeDialog} closeOnOutsideClick>
        <div className="dialog-container"
          style={{
            display: "block",
            justifyItems: "center",
            padding: "20px",
            minHeight: "500px",
            minWidth: "900px"
          }}
        >
        <h1>Add your files here</h1>
      <div className="uploadInput">
        <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => setFileData(e.target.files)}
        />
      </div>
      <div className="textfield">
        <h5>Annotation</h5>
        <input 
            type="text"
            onChange={(e) => setAnnotation(e.target.value)}/>
      </div>
      <div className="buttons">
        <button className="uploadButton" onClick={(e) => handleImageUpload(e, annotation, fileData)}>
        Upload
        </button>
        <button onClick={closeDialog}>
        Close
        </button>
      </div>
        </div>
      </Modal>)
}