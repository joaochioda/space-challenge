/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate } from "react-router-dom";

const Logged = () => {
    const { handleBearer, user, handleService } = useContext(UserContext);

    useEffect(() => {
        const href = window.location.href;
        const bearer = href.split("bearer=")[1];
        const service = href.split("service=")[1];
        handleBearer(bearer);
        handleService(service);
    }, [handleBearer])

    return (
        <div>
            <h1>Logged</h1>
            {user &&
                <Navigate to="/" />}
        </div>
    )
}

export default Logged;