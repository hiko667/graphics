import { createContext, useCallback, useLayoutEffect, useContext, useEffect, useMemo, useId, useRef } from "react"

const CanvasContext = createContext(null)

export default function Canvas({
    height = 1080, width = 1920, children, ...canvasProps }) {
    const canvasRef = useRef(null)
    const items = useRef(new Map())
    const frame = useRef(0)

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
        const dpr = window.devicePixelRatio || 1
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
        invalidate()
    }, [width, height, invalidate])

    return (
        <CanvasContext.Provider value={api}>
            <div className="overflow-auto">
                <canvas ref={canvasRef} {...canvasProps} />
                {children}
            </div>
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
            ctx.lineTo(x + vx, y + vy);
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            ctx.stroke();
        },
        [x, y, vx, vy, color, width]
    );
    useDraw(draw)
    return null;
}