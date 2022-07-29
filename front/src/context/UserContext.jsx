/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, createContext, useEffect } from "react";
import http from "../service/httpService"

export const UserContext = createContext();

export default function UserProvider(props) {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    // const [user, setUser] = useState({ name: 'test', image: '' }); //disable login twitch

    useEffect(() => {
        if (window.location.pathname === '/servers-down') return
        getMe();
    }, [])

    async function getMe() {
        console.log(process.env.REACT_APP_ENV)
        try {
            if (process.env.REACT_APP_ENV === 'dev') {
                setUser({ name: 'test', image: 'https://avatars.githubusercontent.com/u/47106171?v=4' });
                return;
            }
            else if (!user) {
                const response = await http.get(`/me`);
                if (response) {
                    setUser(response.data);
                } else {
                    setUser(null);
                    setError('No user found');
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
            <UserContext.Provider value={{ user, setUser, getMe, handleBearer, error }}>
                {props.children}
            </UserContext.Provider>
        </div>
    )
}