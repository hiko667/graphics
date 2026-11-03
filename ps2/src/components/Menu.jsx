import React, { useRef } from 'react';
import Button from 'react-bootstrap/Button';
import { FilePlus2Icon } from 'lucide-react';
import { Image } from 'lucide-react';
import { Badge, Form } from 'react-bootstrap';

export default function Menu({ onFileUpload, onSaveJPG, jpegQuality, setJpegQuality }) {
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && onFileUpload) {
            onFileUpload(file);
        }
    };

    return (
        <div className="h-100 d-flex align-items-center m-3" style={{
            width: "130px",
            overflow: "hidden"
        }}>
            <div style={{
                width: "100%",
                height: "90%"
            }}
            className="border border-light text-light d-flex flex-column gap-3 align-items-center justify-content-start p-3 rounded">
                
                <input
                    type="file"
                    accept=".ppm,.jpg,.jpeg,.png"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />

                <Button variant='light' onClick={handleButtonClick}>
                    Wczytaj
                    <FilePlus2Icon/>
                </Button>

                <Button variant='light' onClick={onSaveJPG}>
                    Zapisz JPEG
                    <Image/>
                </Button>
                {/* <p>JPEG compression</p> */}
                <Badge bg="light" text='dark'>
                    {Math.round(jpegQuality * 100)} %
                </Badge>
                <Form.Range
                    min="0.05"
                    max="1.0"
                    step="0.05"
                    value={jpegQuality}
                    onChange={(e) => setJpegQuality(parseFloat(e.target.value))}
                />
            </div>
        </div>
    );
}