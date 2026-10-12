import Menu from "./Menu";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";
import { Line } from "./Canvas";
import { useState } from "react";

export default function DrawingSpace(){
    const [mode, setMode] = useState("line")

    const handleClick = ({x, y}) => {
        
    }

    return(
        <div className="w-100 vh-100 d-flex flex-column overflow-hidden">
            <Menu/>
            <div className='w-100 flex-grow-1 gap-1 p-1 bg-dark d-flex overflow-hidden'>
                <Toolbar mode={mode} setMode={(e) => setMode(e)}/>
                <div className='bg-light border rounded-1 m-3 d-flex flex-grow-1 flex-row overflow-hidden'>
                    <div className='w-100 h-100 overflow-auto'>
                        <Canvas className = "w-100 h-100">
                            <Line x={1} y={12} vx={1000} vy={100} width={10}/>
                            <Line x={1} y={12} vx={1000} vy={1000} width={10}/>
                        </Canvas>
                    </div>
                </div>
            </div>
        </div>
    )
}