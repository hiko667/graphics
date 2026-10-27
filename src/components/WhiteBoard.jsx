import Canvas, { Rectangle, Line, Circle } from "./Canvas"
import { useEffect, useState } from "react"
import TerminalModal from "./TerminalModal"

export default function WhiteBoard({ mode, show, onHide, fileTrigger }) {
    const [items, setItems] = useState([])
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [lastClick, setLastClick] = useState({ x: 0, y: 0 })
    const [selectedId, setSelectedId] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [activeHandle, setActiveHandle] = useState(null)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

    const HANDLE_SIZE = 8;

    useEffect(() => {
        if (fileTrigger === "save") {
            const serializedItems = items.map(item => ({
                type: item.type,
                x: item.x,
                y: item.y,
                ...(item.vx !== undefined && { vx: item.vx }),
                ...(item.vy !== undefined && { vy: item.vy }),
                ...(item.radius !== undefined && { radius: item.radius }),
                ...(item.w !== undefined && { w: item.w }),
                ...(item.h !== undefined && { h: item.h }),
                ...(item.color && { color: item.color }),
                ...(item.width !== undefined && { width: item.width })
            }));

            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(serializedItems));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", "whiteboard.json");
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
        }
        if (fileTrigger === "load") {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        try {
                            const parsed = JSON.parse(event.target.result);
                            const deserializedItems = parsed.map(item => ({
                                type: item.type,
                                x: item.x,
                                y: item.y,
                                ...(item.vx !== undefined && { vx: item.vx }),
                                ...(item.vy !== undefined && { vy: item.vy }),
                                ...(item.radius !== undefined && { radius: item.radius }),
                                ...(item.w !== undefined && { w: item.w }),
                                ...(item.h !== undefined && { h: item.h }),
                                ...(item.color && { color: item.color }),
                                ...(item.width !== undefined && { width: item.width })
                            }));
                            setItems(deserializedItems);
                        } catch (err) {
                            console.error("Błąd parsowania pliku");
                        }
                    };
                    reader.readAsText(file);
                }
            };
            input.click();
        }
    }, [fileTrigger])


    const handleAddShape = (newShape) => {
        setItems(prevItems => [newShape, ...prevItems]);
    }

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

    const getHandles = (item) => {
        if (item.type === "line") {
            return [
                { name: "start", x: item.x, y: item.y },
                { name: "end", x: item.vx, y: item.vy }
            ]
        }
        if (item.type === "circle") {
            return [
                { name: "top", x: item.x, y: item.y - item.radius },
                { name: "right", x: item.x + item.radius, y: item.y },
                { name: "bottom", x: item.x, y: item.y + item.radius },
                { name: "left", x: item.x - item.radius, y: item.y }
            ]
        }
        if (item.type === "rectangle") {
            const x2 = item.x + item.w
            const y2 = item.y + item.h
            return [
                { name: "tl", x: item.x, y: item.y },
                { name: "tr", x: x2, y: item.y },
                { name: "br", x: x2, y: y2 },
                { name: "bl", x: item.x, y: y2 }
            ]
        }
        return []
    }

    const checkHandleClick = (x, y, item) => {
        const handles = getHandles(item)
        for (let h of handles) {
            if (Math.hypot(x - h.x, y - h.y) <= HANDLE_SIZE) {
                return h.name
            }
        }
        return null
    }

    const handleMouseDown = () => {
        if (selectedId !== null) {
            const handleName = checkHandleClick(mousePosition.x, mousePosition.y, items[selectedId])
            if (handleName) {
                setActiveHandle(handleName)
                return
            }
        }

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
            setActiveHandle(null)
        }
    }

    const handleMouseMove = (value) => {
        setMousePosition(value)

        if (activeHandle !== null && selectedId !== null) {
            setItems(prevItems => {
                const updated = [...prevItems]
                const item = { ...updated[selectedId] }

                if (item.type === "line") {
                    if (activeHandle === "start") {
                        item.x = value.x
                        item.y = value.y
                    } else if (activeHandle === "end") {
                        item.vx = value.x
                        item.vy = value.y
                    }
                } else if (item.type === "circle") {
                    item.radius = Math.hypot(value.x - item.x, value.y - item.y)
                } else if (item.type === "rectangle") {
                    if (activeHandle === "br") {
                        item.w = value.x - item.x
                        item.h = value.y - item.y
                    } else if (activeHandle === "tl") {
                        const oldX2 = item.x + item.w
                        const oldY2 = item.y + item.h
                        item.x = value.x
                        item.y = value.y
                        item.w = oldX2 - value.x
                        item.h = oldY2 - value.y
                    } else if (activeHandle === "tr") {
                        const oldY2 = item.y + item.h
                        item.y = value.y
                        item.w = value.x - item.x
                        item.h = oldY2 - value.y
                    } else if (activeHandle === "bl") {
                        const oldX2 = item.x + item.w
                        item.x = value.x
                        item.w = oldX2 - value.x
                        item.h = value.y - item.y
                    }
                }

                updated[selectedId] = item
                return updated
            })
            return
        }

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
        if (activeHandle) {
            setActiveHandle(null)
            return
        }

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
    const handleUpdateShape = (newValues) => {
        if (selectedId === null) return
        setItems(prevItems => {
            const updated = [...prevItems]
            updated[selectedId] = {
                ...updated[selectedId],
                ...newValues
            }
            return updated
        })
    }
    const renderHandles = () => {
        if (selectedId === null || !items[selectedId]) return null
        const handles = getHandles(items[selectedId])
        return handles.map((h, i) => (
            <Circle
                key={`handle-${i}`}
                x={h.x}
                y={h.y}
                radius={HANDLE_SIZE / 2}
                color="#0000ff"
                width={2}
            />
        ))
    }

    return (
        <div style={{ width: "100%", height: "100%" }} className="w-100 h-100">
            <TerminalModal 
                show={show} 
                onHide={onHide} 
                onAddShape={handleAddShape} 
                selectedItem={selectedId !== null ? items[selectedId] : null}
                onUpdateShape={handleUpdateShape}
            />            
            <Canvas
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                changeMousePosition={handleMouseMove}
            >
                {items.map((e, index) => renderComponent(e, index))}
                {renderHandles()}
            </Canvas>
        </div>
    )
}