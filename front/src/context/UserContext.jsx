import React, { useState, createContext, useEffect } from "react";
import axios from "axios";
const baseUrl = 'http://localhost:3333';

export const UserContext = createContext();

export default function UserProvider(props) {
    const [user, setUser] = useState(null);

    async function loginTwitch() {
        try {
            if (user) {
                return user;
            }
            const response = await axios.get(`${baseUrl}`);
            console.log(response)
            if (response.data === 'Need login') {
                console.log('1')
                window.location.href = `${baseUrl}/auth/twitch`;
            } else {
                console.log('2')
                console.log(response.data)
                setUser(response.data);
            }
            // const response = await axios.get(`${baseUrl}/`);
            // localStorage.setItem(BE_TOKEN, JSON.stringify(auth.data.token));
            // const user = await axios.get(`${baseUrl}/user`);
            // user.data.full_public_address = accounts[0];
            // setUser(user.data);
            // navigate('/');
            // console.log('responseeeeeeeeeee', response)
        } catch (ex) {
            // setMessage('')
            console.log(ex)
        }
    }

    return (
        <div>
            <UserContext.Provider value={{ user, loginTwitch }}>
                {props.children}
            </UserContext.Provider>
        </div>
    )
}