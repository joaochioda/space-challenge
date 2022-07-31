/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, lazy, Suspense } from "react";
import { UserContext } from "../context/UserContext";

const Main = lazy(() => import("../Main"));

const Login = () => {
  const { user, error, loginTwitch, loginGoogle } = useContext(UserContext);

  if (error) {
    return <p>Sorry we are having problems with our servers!</p>;
  }

  function renderComponents() {
    if (user) {
      return (
        <Suspense fallback={<div>Loading...</div>}>
          <Main />
        </Suspense>
      );
    } else if (error) {
      return <p>Sorry we are having problems with our servers!</p>;
    } else {
      return (
        <>
          <div onClick={loginTwitch}>Login Twitch</div>
          <div onClick={loginGoogle}>Login google</div>
        </>
      );
    }
  }

  return <div>{renderComponents()}</div>;
};

export default Login;
