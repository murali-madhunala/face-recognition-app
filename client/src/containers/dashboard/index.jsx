import axios from "axios";
import { useState, useEffect } from "react";
import { UploadFile } from "../../components/uploadPicture/upload";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

export const Dashboard = () => {
  const [triggerUpload, setTriggerUpload] = useState(undefined);
  const [toggleModal, setToggleModal] = useState(false);
  const [fileConfig, setFileConfig] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.state === 'admin';

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-auth-token": localStorage.getItem('token')
    },
  };

  useEffect(() => {
    const getExistingUploads = async() => {
      try {
        let api = isAdmin ? 'api/requests/admin' : 'api/requests';
      const { data } = await axios.get(api, {
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
    if(!localStorage.getItem('token')?.length) {
      navigate('/');
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
          status: 'Processed',
          user: isAdmin ? "admin" : ""
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
        user: isAdmin ? "admin" : ""
      }
    })
    setTimeout(() => {
      setFileConfig({
        ...fileConfig,
        [annotation]: {
          file: fileData[0],
          url: URL.createObjectURL(fileData[0]),
          status: 'In Progress',
          user: isAdmin ? "admin" : ""
        }
      })
      setTriggerUpload({file: fileData[0], annotation});
    }, 3000);
    setToggleModal(false);
  };
  return (<>
    <div className="header">
      <div className="logout"><h1> FACE RECOGNITION DASHBOARD </h1> <button onClick={() => {
        navigate('/');
        localStorage.removeItem('token')}}>
           LOGOUT </button></div>
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
            {isAdmin && <th> User </th>}
            <th>Annotation</th>
            <th>Photo Preview</th>
            <th>Status</th>
            <th>No. of Faces</th>
            {/* <th>Thumbnail</th> */}
          </tr>
          {Object.keys(fileConfig).map((row, i) =>
          (<tr key={`${row}-${i}`}>
            {isAdmin && <td>{fileConfig[row].user}</td>}
            <td>{row}</td>
            <td><img src={fileConfig[row].url} height={100} width={100}
              key={`${row}-${i}`} alt={fileConfig[row].file?.name} /></td>
            <td>{fileConfig[row].status}</td>
            <td>{fileConfig[row]?.faces || '-'}</td>
            {/* <td>{'todo'}</td> */}
          </tr>))}
        </tbody>
      </table> : null}
    </div>
  </>
  );
};
