import axios from "axios";
import { useState, useEffect } from "react";
import { UploadFile } from "../../components/uploadPicture/upload";
import "./dashboard.css";

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
    const getExistingUploads = async() => {
      try {
      const { data } = await axios.get('api/requests', {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-auth-token": localStorage.getItem('token')
        },
      });
      let config = {}
      data.data.map(img => {
        config = { ...config, [img.annotation]: {
          status: 'Processed',
          user: img?.username,
          faces: img.facesCount || 0,
          url: `http://localhost:5001/static/${img.imagePath}`
        }}
      })
      setFileConfig(config)
      } catch(e){
        console.log(e, 'error');
      }
    }
    getExistingUploads();
  }, []);

  useEffect(() => {
    if (triggerUpload?.annotation) {
      const fetchFaces = async ({ file, annotation }) => {
        const formData = new FormData();
        formData.append("files", file);
        formData.append("annotation", annotation);
        try {
        const { data } = await axios.post('api/requests/upload', formData, config);
        setFileConfig({ ...fileConfig, [data.annotation]: {
          ...fileConfig[data.annotation],
          faces: data.facesCount,
          status: 'Processed'
        }})
        } catch(e){
          console.log(e, 'error');
        }
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
          status: 'In Progress',
        }
      })
      setTriggerUpload({file: fileData[0], annotation});
    }, 3000);
    setToggleModal(false);
  };
  return (<>
    <div className="header">
      <h1> FACE RECOGNITION DASHBOARD </h1>
      <UploadFile toggleModal={toggleModal} closeDialog={() => setToggleModal(false)}
        handleImageUpload={handleImageUpload} />
      <div className="menubar">
        <h2>{Object.keys(fileConfig).length ? 'Status of upload files'
          : 'Click on upload to add files'}</h2>
        <button className="button" onClick={() => setToggleModal(true)}>
          Upload
        </button>
      </div>
    </div>
    <div className="imageList">
      {Object.keys(fileConfig).length ? <table>
        <tbody>
          <tr>
            <th>Annotation</th>
            <th>Photo Preview</th>
            <th>Status</th>
            <th>No. of Faces</th>
          </tr>
          {Object.keys(fileConfig).map((row, i) =>
          (<tr key={`${row}-${i}`}>
            <td>{row}</td>
            <td><img src={fileConfig[row].url} height={100} width={100}
              key={`${row}-${i}`} alt={fileConfig[row].file?.name} /></td>
            <td>{fileConfig[row].status}</td>
            <td>{fileConfig[row]?.faces || '-'}</td>
          </tr>))}
        </tbody>
      </table> : null}
    </div>
  </>
  );
};
