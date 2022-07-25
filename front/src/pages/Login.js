/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, lazy } from "react";
import { UserContext } from "../context/UserContext";

const Main = lazy(() => import("../Main"));

const Login = () => {
  const { user } = useContext(UserContext);

  return <div>{user ? <Main /> : <div>Loading...</div>}</div>;
};

export default Login;
