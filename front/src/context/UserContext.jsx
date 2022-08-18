/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, createContext, useEffect } from "react";
import http from "../service/httpService"
import { getStorage } from '../service/storageService'
export const UserContext = createContext();

export default function UserProvider(props) {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    // const [user, setUser] = useState({ name: 'test', image: '' }); //disable login twitch

    useEffect(() => {
        if (window.location.pathname === '/servers-down') return
        if (getStorage()) {
            getMe();
        }
    }, [])

    function loginTwitch() {
        if (process.env.REACT_APP_ENV === 'dev') {
            getMe();
        } else {
            window.location.href = `${process.env.REACT_APP_TWITCH}/api/auth/twitch`;
        }
    }

    function loginGoogle() {
        if (process.env.REACT_APP_ENV === 'dev') {
            getMe();
        } else {
            window.location.href = `${process.env.REACT_APP_GOOGLE}/auth/google`;
        }
    }

    async function getMe() {
        try {
            if (process.env.REACT_APP_ENV === 'dev') {
                setUser({ name: 'test', image: 'https://avatars.githubusercontent.com/u/47106171?v=4' });
                return;
            }
            else if (!user) {
                const response = await http.get(`/me`);
                if (response && response.status === 200) {
                    setUser(response.data);
                } else if (response && response.status === 401) {
                    setError('Redirecting')
                }
                else {
                    setUser(null);
                    setError('Sorry we are having problems with our servers!');
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

    function handleService(service) {
        if (service) {
            localStorage.setItem('SERVICE', JSON.stringify(service));
        }
    }
    return (
        <div>
            <UserContext.Provider value={{ user, setUser, getMe, handleBearer, error, loginTwitch, handleService, loginGoogle }}>
                {props.children}
            </UserContext.Provider>
        </div>
    )
}