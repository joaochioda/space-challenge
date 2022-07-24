/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, createContext, useEffect } from "react";
import http from "../service/httpService"

export const UserContext = createContext();

export default function UserProvider(props) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        getMe();
    }, [])

    async function getMe() {
        try {
            if (!user) {
                const response = await http.get(`/me`);
                if (response) {
                    setUser(response.data);
                }
            }
        } catch (ex) {
            console.log(ex)
        }
    }

    function handleBearer(bearer) {
        if (bearer) {
            localStorage.setItem('JWT_TOKEN_SPACE', JSON.stringify(bearer));
        }
    }
    return (
        <div>
            <UserContext.Provider value={{ user, setUser, getMe, handleBearer }}>
                {props.children}
            </UserContext.Provider>
        </div>
    )
}