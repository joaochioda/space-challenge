/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import Main from "../Main";

const Login = () => {
  const { user } = useContext(UserContext);

  return <div>{user ? <Main /> : <div>Loading...</div>}</div>;
};

export default Login;
