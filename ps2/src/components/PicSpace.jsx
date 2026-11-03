import React, { useState, useRef, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import { Button } from 'react-bootstrap';
import { Image } from 'lucide-react';
import { Form } from 'react-bootstrap';

export default function PicSpace({ setErrorMessage, setIsDragging, setDragStart, imageBuffer, zoom, setZoom, pan, setPan, isDragging, dragStart, jpegQuality }) {

    const canvasRef = useRef(null);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };


    const handleWheel = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const zoomFactor = 1.1;
        let newZoom;

        if (e.deltaY < 0) {
            newZoom = zoom * zoomFactor;
        } else {
            newZoom = zoom / zoomFactor;
        }

        newZoom = Math.max(0.1, Math.min(newZoom, 500));

        const newPanX = mouseX - (mouseX - pan.x) * (newZoom / zoom);
        const newPanY = mouseY - (mouseY - pan.y) * (newZoom / zoom);

        setZoom(newZoom);
        setPan({ x: newPanX, y: newPanY });
    };

    useEffect(() => {
        console.log(imageBuffer)
        if (!imageBuffer || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = canvas.parentElement.clientWidth || 800;
        canvas.height = 600;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = false;

        ctx.save();
        ctx.translate(pan.x, pan.y);
        ctx.scale(zoom, zoom);

        let imgData = imageBuffer;

        if (!(imgData instanceof ImageData)) {
            try {
                const clamped = imgData.data instanceof Uint8ClampedArray
                    ? imgData.data
                    : new Uint8ClampedArray(imgData.data);
                imgData = new ImageData(clamped, imgData.width, imgData.height);
            } catch (err) {
                console.error("Nie można skonwertować imageBuffer do ImageData:", err);
                return;
            }
        }

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = imgData.width;
        tempCanvas.height = imgData.height;
        tempCanvas.getContext('2d').putImageData(imgData, 0, 0);

        ctx.drawImage(tempCanvas, 0, 0);

        if (zoom >= 15) {
            const data = imgData.data;
            ctx.font = '0.1px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            for (let y = 0; y < imgData.height; y++) {
                for (let x = 0; x < imgData.width; x++) {
                    const idx = (y * imgData.width + x) * 4;
                    const r = data[idx];
                    const g = data[idx + 1];
                    const b = data[idx + 2];

                    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
                    ctx.lineWidth = 0.05;
                    ctx.strokeRect(x, y, 1, 1);

                    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                    ctx.fillStyle = brightness > 128 ? 'black' : 'white';

                    ctx.fillText(`R:${r}`, x + 0.5, y + 0.25);
                    ctx.fillText(`G:${g}`, x + 0.5, y + 0.5);
                    ctx.fillText(`B:${b}`, x + 0.5, y + 0.75);
                }
            }
        }

        ctx.restore();
    }, [imageBuffer, zoom, pan]);

    return (
        <>
            <div className="w-100 h-100" style={{
                overflow : "hidden"
            }}>
                <div
                    className=''
                    style={{ overflow: 'hidden', cursor: isDragging ? 'grabbing' : 'grab', height: '100%', width: "100%" }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                >
                    <canvas ref={canvasRef} />
                </div>
            </div>
        </>
    );
}