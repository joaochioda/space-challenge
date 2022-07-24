import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate } from "react-router-dom";

const Logged = () => {
    const { handleBearer, user } = useContext(UserContext);

    useEffect(() => {
        const href = window.location.href;
        const bearer = href.split("bearer=")[1];
        handleBearer(bearer);
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