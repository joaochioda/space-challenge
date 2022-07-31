/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate } from "react-router-dom";

const Logged = () => {
    const { handleBearer, user, handleService } = useContext(UserContext);

    useEffect(() => {
        const href = window.location.href;
        if (href.includes('/logged')) {
            const allStringParams = href.split("bearer=")[1];
            const params = allStringParams.split("?service=");

            handleBearer(params[0]);
            handleService(params[1]);
        }
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