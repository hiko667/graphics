import Canvas, { Rectangle, Line, Circle } from "./Canvas"
import { useState } from "react"

export default function WhiteBoard({ mode }) {
    const [items, setItems] = useState([])
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [lastClick, setLastClick] = useState({ x: 0, y: 0 })
    const [selectedId, setSelectedId] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

    const isNearEdge = (x, y, item) => {
        const distanceToSegment = (px, py, ax, ay, bx, by) => {
            const l2 = (bx - ax) ** 2 + (by - ay) ** 2
            if (l2 === 0) return Math.hypot(px - ax, py - ay)
            let t = ((px - ax) * (bx - ax) + (py - ay) * (by - ay)) / l2
            t = Math.max(0, Math.min(1, t))
            return Math.hypot(px - (ax + t * (bx - ax)), py - (ay + t * (by - ay)))
        }

        if (item.type === "line") {
            return distanceToSegment(x, y, item.x, item.y, item.vx, item.vy) < 5
        } else if (item.type === "rectangle") {
            const rx = item.w < 0 ? item.x + item.w : item.x
            const ry = item.h < 0 ? item.y + item.h : item.y
            const rw = Math.abs(item.w)
            const rh = Math.abs(item.h)
            
            const onTop = Math.abs(y - ry) < 5 && x >= rx && x <= rx + rw
            const onBottom = Math.abs(y - (ry + rh)) < 5 && x >= rx && x <= rx + rw
            const onLeft = Math.abs(x - rx) < 5 && y >= ry && y <= ry + rh
            const onRight = Math.abs(x - (rx + rw)) < 5 && y >= ry && y <= ry + rh
            return onTop || onBottom || onLeft || onRight
        } else if (item.type === "circle") {
            const distFromCenter = Math.hypot(x - item.x, y - item.y)
            return Math.abs(distFromCenter - item.radius) < 5
        }
        return false
    }

    const handleMouseDown = () => {
        const clickedItemIndex = items.findIndex(item => 
            isNearEdge(mousePosition.x, mousePosition.y, item)
        )

        if (clickedItemIndex !== -1) {
            setSelectedId(clickedItemIndex)
            setIsDragging(true)
            setDragOffset({
                x: mousePosition.x - items[clickedItemIndex].x,
                y: mousePosition.y - items[clickedItemIndex].y
            })
        } else {
            setLastClick(mousePosition)
            setSelectedId(null)
        }
    }

    const handleMouseMove = (value) => {
        setMousePosition(value)
        if (isDragging && selectedId !== null) {
            setItems(prevItems => {
                const updated = [...prevItems]
                const item = updated[selectedId]
                const newX = value.x - dragOffset.x
                const newY = value.y - dragOffset.y
                const dx = newX - item.x
                const dy = newY - item.y

                updated[selectedId] = {
                    ...item,
                    x: newX,
                    y: newY,
                    ...(item.type === "line" && {
                        vx: item.vx + dx,
                        vy: item.vy + dy
                    })
                }
                return updated
            })
        }
    }

    const handleMouseUp = () => {
        setSelectedId(null)
        if (isDragging) {
            setIsDragging(false)
            return
        }
        
        if (selectedId === null && mode) {
            let newItem;
            switch (mode) {
                case "line":
                    newItem = {
                        type: mode, 
                        x: lastClick.x, 
                        y: lastClick.y, 
                        vx: mousePosition.x, 
                        vy: mousePosition.y
                    }
                    break;
                case "circle":
                    const radius = Math.hypot(mousePosition.x - lastClick.x, mousePosition.y - lastClick.y)
                    newItem = {
                        type: mode,
                        x: lastClick.x,
                        y: lastClick.y,
                        radius: radius
                    }
                    break;
                case "rectangle":
                    const w = mousePosition.x - lastClick.x;
                    const h = mousePosition.y - lastClick.y;
                    newItem = {
                        type: mode, 
                        x: lastClick.x, 
                        y: lastClick.y,
                        w: w,
                        h: h
                    }
                    break;
                default:
                    break;
            }
            if (newItem) {
                setItems([newItem, ...items])
            }
        }
    }

    const renderComponent = (element, index) => {
        let props = {
            x: element.x,
            y: element.y,
            color: index === selectedId ? "#ff0000" : (element.color || "#000000"),
            width: element.width || 1
        }

        switch (element.type) {
            case "circle": 
                props = { radius: element.radius, ...props }
                return <Circle key={index} {...props} />
            case "rectangle": 
                props = { h: element.h, w: element.w, ...props }
                return <Rectangle key={index} {...props} />
            case "line": 
                props = { vx: element.vx, vy: element.vy, ...props }
                return <Line key={index} {...props} />
            default: return null
        }
    }

    return (
        <div style={{ width: "100%", height: "100%" }} className="w-100 h-100">
            <Canvas 
                onMouseDown={handleMouseDown} 
                onMouseUp={handleMouseUp} 
                changeMousePosition={handleMouseMove}
            >
                {items.map((e, index) => renderComponent(e, index))}
            </Canvas>
        </div>
    )
}