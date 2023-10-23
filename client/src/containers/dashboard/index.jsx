import axios from "axios";
import { useState, useEffect } from "react";
import { UploadFile } from "../../components/uploadPicture/upload";

export const Dashboard = () => {
  const [triggerUpload, setTriggerUpload] = useState(undefined);
  const [toggleModal, setToggleModal] = useState(false);
  const [fileConfig, setFileConfig] = useState({});
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-auth-token": localStorage.getItem('token')
    },
  };

  useEffect(() => {
    if (triggerUpload?.annotation) {
      const fetchFaces = async ({ file, annotation }) => {
        const formData = new FormData();
        formData.append("files", file);
        formData.append("annotation", annotation);
        await axios.post('api/requests/upload', formData, config);
      }
      fetchFaces(triggerUpload).catch(console.error);
    }
  }, [triggerUpload?.annotation])

  const handleImageUpload = async (e, annotation, fileData) => {
    setFileConfig({
      ...fileConfig,
      [annotation]: {
        file: fileData[0],
        url: URL.createObjectURL(fileData[0]),
        status: 'ENQUE',
      }
    })
    setTimeout(() => {
      setFileConfig({
        ...fileConfig,
        [annotation]: {
          file: fileData[0],
          url: URL.createObjectURL(fileData[0]),
          status: 'In Progress'
        }
      })
      setTriggerUpload({file: fileData[0], annotation});

    // }, 5000);
    }, 1000);
    setToggleModal(false);
  };
  return (<>
    <div className="header">
      <h1> FACE RECOGNITION DASHBOARD </h1>
      <UploadFile toggleModal={toggleModal} closeDialog={() => setToggleModal(false)}
        handleImageUpload={handleImageUpload} />
      <div className="menubar">
        <h2>'Click on upload to add files'</h2>
        <button className="button" onClick={() => setToggleModal(true)}>
          Upload
        </button>
      </div>
    </div>
  </>
  );
};
