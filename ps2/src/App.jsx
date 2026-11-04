import { Button } from "react-bootstrap"
import Menu from "./components/Menu"
import { FilePlus2Icon } from "lucide-react"
import ErorrModal from "./components/ErrorModal"
import { useState, useEffect } from "react"
import PicSpace from "./components/PicSpace"
import ImageViewer from "./components/gem"

export default function App(){
    const [showModal, setShowModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [imageBuffer, setImageBuffer] = useState(true)
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [jpegQuality, setJpegQuality] = useState(0.8);
    
    useEffect(() => {
        if(errorMessage !== ""){
            setShowModal(true)
            console.log(errorMessage)
        }
    }, [errorMessage])
    
    const parsePPM = (buffer) => {
        const bytes = new Uint8Array(buffer);
        let offset = 0;

        const readToken = () => {
            while (offset < bytes.length) {
                while (offset < bytes.length && bytes[offset] <= 32) {
                    offset++;
                }
                if (bytes[offset] === 35) {
                    while (offset < bytes.length && bytes[offset] !== 10 && bytes[offset] !== 13) {
                        offset++;
                    }
                } else {
                    break;
                }
            }

            if (offset >= bytes.length) return null;

            const start = offset;
            while (offset < bytes.length && bytes[offset] > 32) {
                offset++;
            }
            return new TextDecoder('ascii').decode(bytes.subarray(start, offset));
        };
        const header = readToken();

        const width = parseInt(readToken(), 10);
        const height = parseInt(readToken(), 10);
        const maxVal = parseInt(readToken(), 10);

        if (isNaN(width) || isNaN(height) || isNaN(maxVal) || maxVal <= 0) {
            throw new Error('PPM header error.');
        }

        if (header === 'P6' && offset < bytes.length && bytes[offset] <= 32) {
            offset++;
        }

        const imgData = new ImageData(width, height);
        const data = imgData.data;

        if (header === 'P3') {
            let i = 0;
            const totalPixels = width * height * 4;
            while (i < totalPixels && offset < bytes.length) {
                const rToken = readToken();
                const gToken = readToken();
                const bToken = readToken();

                if (!rToken || !gToken || !bToken) break;

                const r = parseInt(rToken, 10);
                const g = parseInt(gToken, 10);
                const b = parseInt(bToken, 10);

                if (isNaN(r) || isNaN(g) || isNaN(b)) {
                    throw new Error('Bad data at P3.');
                }

                data[i] = Math.round((r / maxVal) * 255);
                data[i + 1] = Math.round((g / maxVal) * 255);
                data[i + 2] = Math.round((b / maxVal) * 255);
                data[i + 3] = 255;
                i += 4;
            }
        } else if (header === 'P6') {
            let i = 0;
            const totalBytes = width * height * 3;
            const pixelData = bytes.subarray(offset, offset + totalBytes);

            if (pixelData.length < totalBytes) {
                throw new Error('P6 file uncomplete.');
            }

            let srcIdx = 0;
            while (srcIdx < totalBytes) {
                const r = pixelData[srcIdx];
                const g = pixelData[srcIdx + 1];
                const b = pixelData[srcIdx + 2];

                data[i] = Math.round((r / maxVal) * 255);
                data[i + 1] = Math.round((g / maxVal) * 255);
                data[i + 2] = Math.round((b / maxVal) * 255);
                data[i + 3] = 255;

                srcIdx += 3;
                i += 4;
            }
        }
        console.log(imgData)
        return imgData;
    }
    
    const parseStandardImage = (file) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);

            img.onload = () => {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = img.width;
                tempCanvas.height = img.height;
                const ctx = tempCanvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const imgData = ctx.getImageData(0, 0, img.width, img.height);
                URL.revokeObjectURL(url);
                resolve(imgData);
            };

            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('Failed at loading JPEG/PNG'));
            };

            img.src = url;
        });
    };

    const handleSaveJpeg = async () => {
        if (!imageBuffer) return;

        try {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = imageBuffer.width;
            tempCanvas.height = imageBuffer.height;
            const ctx = tempCanvas.getContext('2d');
            ctx.putImageData(imageBuffer, 0, 0);

            const dataUrl = tempCanvas.toDataURL('image/jpeg', parseFloat(jpegQuality));
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `image_q${Math.round(jpegQuality * 100)}.jpg`;
            link.click();
        } catch (err) {
            setErrorMessage('Failed saving JPEG: ' + err.message);
        }
    };

    const onFileUpload = async (file) => {
        // const file = e.target.files[0];
        try{
            if(file.name.endsWith(".ppm")){
                const buffer = await file.arrayBuffer();
                const parsedData = parsePPM(buffer);
                setImageBuffer(parsedData);
            }else if(file.name.endsWith(".jpg") || file.name.endsWith(".jpeg") || file.name.endsWith(".png")){
                const parsedData = await parseStandardImage(file);
                setImageBuffer(parsedData);
            }else{
                throw new Error('Unknown file format: ppm, jpg, jpeg, png')
            }
        }catch(error){
            setErrorMessage(error.message)
        }
    }



    return(
        <>
            <div className="w-100 d-flex gap-1 h-100 bg-dark">
                <ErorrModal show={showModal} onHide={() => setShowModal(false)} errorMessage={errorMessage}/>

                <Menu 
                    jpegQuality={jpegQuality} 
                    setJpegQuality={(e) => setJpegQuality(e)} 
                    onFileUpload={(e) => onFileUpload(e)}
                    onSaveJPG={(e) => handleSaveJpeg(e)}/>
                <PicSpace
                    setErrorMessage = {setErrorMessage}
                    imageBuffer = {imageBuffer}
                    setDragStart={setDragStart}
                    zoom = {zoom}
                    pan = {pan}
                    setZoom = {setZoom }
                    setPan = {setPan}
                    isDragging = {isDragging}
                    setIsDragging = {setIsDragging}
                    dragStart = {dragStart}
                />
            </div>
        </>
    )
}