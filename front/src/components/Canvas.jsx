import React, { useRef, useEffect } from 'react'

const Canvas = props => {

    const { draw, ...rest } = props
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        let frameCount = 0
        let animationFrameId

        const render = () => {
            frameCount++
            draw(context, frameCount)
            animationFrameId = window.requestAnimationFrame(render)
        }
        render()

        document.getElementById('canvas').focus();
        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }
    }, [draw])

    return (

        <canvas
            id="canvas"
            tabIndex="0"
            ref={canvasRef} {...rest}
            width={800}
            height={620}
            onKeyDown={(e) => props.handlekeydow(e)}
            onKeyUp={(e) => props.handlekeyupcustom(e)}
        />
    )
}

export default Canvas