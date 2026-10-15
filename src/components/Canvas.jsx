import { createContext, useState, useCallback, useLayoutEffect, useContext, useEffect, useMemo, useId, useRef } from "react"

const CanvasContext = createContext(null)

export default function Canvas({ changeMousePosition, children, ...canvasProps }) {
    const canvasRef = useRef(null)
    const items = useRef(new Map())
    const frame = useRef(0)
    const [size, setSize] = useState({width : 0, height : 0})
    const [currentFigure, setCurrentFigure] = useState(null);

    const handleMouseMovement = (e) => {
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;   
        changeMousePosition({x : x, y : y})     
    }

    const draw = useCallback(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        const dpr = window.devicePixelRatio || 1;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        for (const fn of items.current.values()) {
            ctx.save()
            fn(ctx)
            ctx.restore();
        }
    }, [])

    const invalidate = useCallback(() => {
        if (frame.current) return
        frame.current = requestAnimationFrame(() => {
            frame.current = 0;
            draw()
        }
        )
    }, [draw]);

    const api = useMemo(
        () => ({
            register(id, fn) {
                items.current.set(id, fn)
                invalidate()
            },
            unregister(id) {
                items.current.delete(id);
                invalidate();
            },
        }), [invalidate]
    )

    useLayoutEffect(() => {
        const canvas = canvasRef.current
        const parent = canvas.parentElement        
        const updateSize = () => {
            const width = parent.clientWidth 
            const height = parent.clientHeight
            const dpr = window.devicePixelRatio || 1
            canvas.width = Math.round(width * dpr)
            canvas.height = Math.round(height * dpr)
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`

            setSize({width, height})
            invalidate()
        }
        updateSize()
        const observer = new ResizeObserver(updateSize)
        observer.observe(parent)

        return () => observer.disconnect()

    }, [invalidate])

    return (
        <CanvasContext.Provider value={api}>
                <canvas ref={canvasRef} {...canvasProps} 
                onMouseMove={(e) => handleMouseMovement(e)}/>
                {children}
        </CanvasContext.Provider>
    )
}


export function useDraw(draw) {
    const api = useContext(CanvasContext)
    const id = useId();

    useEffect(() => {api.register(id, draw)}, [api, draw, id])
    useEffect(() => () => api.unregister(id), [api, id])
}

export function Line({
    x, y, vx, vy, color = "#000000", width = 1
}) {
    const draw = useCallback(
        (ctx) => {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(vx, vy);
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            ctx.stroke();
        },
        [x, y, vx, vy, color, width]
    );
    useDraw(draw)
    return null;
}

export function Rectangle({x, y, w, h, color = "#000000", width = 1}){
    const draw = useCallback(
        (ctx) => {
            ctx.beginPath();
            ctx.rect(x, y, w, h);
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            ctx.stroke()
        },
        [x, y, w, h, color, width]
    );
    useDraw(draw);
    return null;
}

export function Circle({x, y, radius, color = "#000000", width = 1}){
    const draw = useCallback(
        (ctx) => {
            ctx.beginPath()
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            ctx.stroke()
        }, [x, y, radius, color, width]
    );
    useDraw(draw);
    return null;
}