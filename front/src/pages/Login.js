/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, lazy } from "react";
import { UserContext } from "../context/UserContext";

const Main = lazy(() => import("../Main"));

const Login = () => {
  const { user, error } = useContext(UserContext);

  if (error) {
    return <p>Sorry we are having problems with our servers!</p>;
  }

  return <div>{user ? <Main /> : <div>Loading...</div>}</div>;
};

export default Login;
