import { useState } from "react";

export const Login = () => {
  const [username, setUsername] = useState("");

  const handleChange = (event) => {
    event.preventDefault();
    setUsername(event.target.value);
  };
  return (
    <>
      <h1>Login Details</h1>
      <div>Enter your Username</div>
      <input type="text" value={username} onChange={handleChange} />
      <button>LOGIN</button>
    </>
  );
};
