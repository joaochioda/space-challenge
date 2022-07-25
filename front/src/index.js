import React from "react";

import ReactDOM from "react-dom/client";
import UserProvider from "./context/UserContext";
import Login from "./pages/Login";
import Logged from "./pages/Logged";

import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserProvider>
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/logged" element={<Logged />} />
          <Route
            path="/servers-down"
            element={<div>Sorry we are having problems with our servers</div>}
          />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </UserProvider>
);
