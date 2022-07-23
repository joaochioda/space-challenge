import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const { loginTwitch } = useContext(UserContext);
  loginTwitch();
  return (
    <div>
      <h1>Login</h1>
    </div>
  );
};

export default Login;
