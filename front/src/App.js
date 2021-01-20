import React, { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [registerUserName, setRegisterUserName] = useState("");
  const [registerUserPassword, setRegisterUserPassword] = useState("");
  const [loginUserName, setLoginUserName] = useState("");
  const [loginUserPassword, setLoginUserPassword] = useState("");
  const [data, setData] = useState(null);

  const register = () => {
    axios({
      method: "POST",
      data: {
        name: registerUserName,
        password: registerUserPassword,
      },
      withCredentials: true,
      url: "http://localhost:4000/register",
    }).then((res) => console.log(res));
  };

  const login = () => {
    axios
      .post(
        "http://localhost:4000/login",
        { name: loginUserName, password: loginUserPassword },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response);
      });
  };
  const getUser = () => {
    axios
      .get("http://localhost:4000/user", { withCredentials: true })
      .then((response) => {
        console.log(response.data);
        setData(response.data);
      });
  };

  return (
    <div className="App">
      <div className="form-group">
        <h1>Register</h1>
        <input
          type="text"
          placeholder="username"
          value={registerUserName}
          onChange={(e) => setRegisterUserName(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={registerUserPassword}
          onChange={(e) => setRegisterUserPassword(e.target.value)}
        />
        <button onClick={register}>Register</button>
      </div>
      <div className="form-group">
        <h1>Login</h1>
        <input
          type="text"
          placeholder="username"
          value={loginUserName}
          onChange={(e) => setLoginUserName(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={loginUserPassword}
          onChange={(e) => setLoginUserPassword(e.target.value)}
        />
        <button onClick={login}>Login</button>
      </div>
      <div className="form-group">
        <h1>Get User</h1>
        <button onClick={getUser}>Get User</button>
      </div>
      {data ? <h1>Wellcome back {data.name}</h1> : null}
    </div>
  );
}

export default App;
