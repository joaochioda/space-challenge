import React from 'react'

const Button = ({ socket }) => {
    return (
        <button onClick={() => socket.emit("test")}>Test</button>
    )
}

export default Button