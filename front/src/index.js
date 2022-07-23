import React from "react";

import ReactDOM from "react-dom/client";
import UserProvider from "./context/UserContext";
import Main from "./Main";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <UserProvider>
              <Login />
            </UserProvider>
          }
        />
        <Route path="/logged" element={<Main />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
