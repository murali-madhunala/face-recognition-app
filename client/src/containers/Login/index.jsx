import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [isAuthenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    event.preventDefault();
    setUsername(event.target.value);
  };
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const url = "/api/generateToken";
  const handleLogin = async () => {
    const { data: token } = await axios.post(url, { username }, config);
    localStorage.setItem("token", token.token);
    setAuthenticated(true);
  };

  useEffect(() => {
    const isAuthenticatedCheck = localStorage?.getItem("token")?.length > 1;
    console.log(isAuthenticated, localStorage?.getItem("token"));

    if (isAuthenticatedCheck) {
      navigate("/dashboard", { state: username });
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <h1>Login Details</h1>
      <div>Enter your Username</div>
      <input type="text" value={username} onChange={handleChange} />
      <button onClick={handleLogin}>LOGIN</button>
    </>
  );
};
