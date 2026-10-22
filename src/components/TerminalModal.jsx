import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function TerminalModal({ show, onHide, onAddShape }) {
    const [shapeType, setShapeType] = useState("rectangle");
    const [formData, setFormData] = useState({
        x: "0",
        y: "0",
        w: "100",
        h: "50",
        radius: "50",
        vx: "100",
        vy: "100"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let newShape;

        const x = parseFloat(formData.x) || 0;
        const y = parseFloat(formData.y) || 0;
        const w = parseFloat(formData.w) || 0;
        const h = parseFloat(formData.h) || 0;
        const radius = parseFloat(formData.radius) || 0;
        const vx = parseFloat(formData.vx) || 0;
        const vy = parseFloat(formData.vy) || 0;

        switch (shapeType) {
            case "rectangle":
                newShape = {
                    type: "rectangle",
                    x: x,
                    y: y,
                    w: w,
                    h: h
                };
                break;
            case "circle":
                newShape = {
                    type: "circle",
                    x: x,
                    y: y,
                    radius: radius
                };
                break;
            case "line":
                newShape = {
                    type: "line",
                    x: x,
                    y: y,
                    vx: vx,
                    vy: vy
                };
                break;
            default:
                return;
        }

        if (onAddShape) {
            onAddShape(newShape);
        }
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Dodaj kształt</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Typ kształtu</Form.Label>
                        <Form.Select 
                            value={shapeType} 
                            onChange={(e) => setShapeType(e.target.value)}
                        >
                            <option value="rectangle">Prostokąt</option>
                            <option value="circle">Koło</option>
                            <option value="line">Linia</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Współrzędna X (początek/środek)</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="x" 
                            value={formData.x} 
                            onChange={handleChange} 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Współrzędna Y (początek/środek)</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="y" 
                            value={formData.y} 
                            onChange={handleChange} 
                        />
                    </Form.Group>

                    {shapeType === "rectangle" && (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>Szerokość (w)</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="w" 
                                    value={formData.w} 
                                    onChange={handleChange} 
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Wysokość (h)</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="h" 
                                    value={formData.h} 
                                    onChange={handleChange} 
                                />
                            </Form.Group>
                        </>
                    )}

                    {shapeType === "circle" && (
                        <Form.Group className="mb-3">
                            <Form.Label>Promień (radius)</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="radius" 
                                value={formData.radius} 
                                onChange={handleChange} 
                            />
                        </Form.Group>
                    )}

                    {shapeType === "line" && (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>Współrzędna końcowa VX</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="vx" 
                                    value={formData.vx} 
                                    onChange={handleChange} 
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Współrzędna końcowa VY</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="vy" 
                                    value={formData.vy} 
                                    onChange={handleChange} 
                                />
                            </Form.Group>
                        </>
                    )}

                    <Button variant="primary" type="submit">
                        Dodaj
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}