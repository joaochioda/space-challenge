/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, lazy, Suspense } from "react";
import { UserContext } from "../context/UserContext";
import OAuthButton from "../components/OAuthButton";

import styled from "styled-components";

const OAuthDiv = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Main = lazy(() => import("../Main"));

const Login = () => {
  const { user, error, loginTwitch, loginGoogle } = useContext(UserContext);

  if (error) {
    return <p>{error}</p>;
  }

  function renderComponents() {
    if (user) {
      return (
        <Suspense fallback={<div>Loading...</div>}>
          <Main />
        </Suspense>
      );
    } else {
      return (
        <OAuthDiv>
          <OAuthButton provider={"twitch"} onClick={loginTwitch} />
          <OAuthButton provider={"google"} onClick={loginGoogle} />
        </OAuthDiv>
      );
    }
  }

  return <div>{renderComponents()}</div>;
};

export default Login;
