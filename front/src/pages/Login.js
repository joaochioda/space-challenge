/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, lazy } from "react";
import { UserContext } from "../context/UserContext";

const Main = lazy(() => import("../Main"));

const Login = () => {
  const { user, error, loginTwitch } = useContext(UserContext);

  if (error) {
    return <p>Sorry we are having problems with our servers!</p>;
  }

  function renderComponents() {
    if (user) {
      return <Main />;
    } else if (error) {
      return <p>Sorry we are having problems with our servers!</p>;
    } else {
      return (
        <>
          <div onClick={loginTwitch}>Login Twitch</div>
          <div>Login google</div>
        </>
      );
    }
  }

  return <div>{renderComponents()}</div>;
};

export default Login;
