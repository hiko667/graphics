import { useState, useRef, useEffect } from "react";



export default function DrawingSpace({mode}) {
    const canvas = useRef(null);
    const [lastPoint, setLastPoint] = useState(null)
    const [lines, setLines] = useState([{ x: 50, y: 50, x1: 200, y1: 100 }, { x: 600, y: 900, x1: 20, y1: 10 }])

    const addToLines = (newLine) => {
        setLines([newLine, ...lines])
    }

    const handleClick = () => {

    }

    useEffect(() => {
        const canvasEle = canvas.current;
        if (!canvasEle) return;
        canvasEle.width = canvasEle.clientWidth;
        canvasEle.height = canvasEle.clientHeight;
        const ctx = canvasEle.getContext("2d");

        const drawLine = (info, style = {}) => {
            const { x, y, x1, y1 } = info;
            const { color = "black", width = 1 } = style;

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x1, y1);
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            ctx.stroke();
        };
        lines.forEach((element) => {
            drawLine(element)
        })

    }, [lines]);

    return (
        <div className="w-100 h-100 d-flex overflow-hidden">
            <canvas ref={canvas} 
            onMouseDown ={() => {
                addToLines({ x: 300, y: 250, x1: 260, y1: 70 })
            }}
            className="w-100 h-100"></canvas>
        </div>
    );
}