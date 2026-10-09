import { Square,  LineDotBottomVertical, Circle} from "lucide-react"
import { Button } from "react-bootstrap"

export default function Toolbar({mode, setMode}){
    
    return(
        <div className="bg-dark border rounded-1 flex d-flex"
        style={{
            maxWidth : "50 px"
        }}
        >
            <div className="w-100 h-100 d-flex gap-3 p-2 flex-column">
                <Button variant="light" disabled = {mode === "line" ? true : false}
                onClick={() => setMode("line")}>
                    <LineDotBottomVertical color="#000000"/>
                </Button>
                <Button variant="light" disabled = {mode === "circle" ? true : false}
                onClick={() => setMode("circle")}>
                    <Circle color="#000000"/>
                </Button>
                <Button variant="light" disabled = {mode === "square" ? true : false}
                onClick={() => setMode("square")}>
                    <Square color="#000000" />
                </Button>
                
            </div>
        </div>
    )
}