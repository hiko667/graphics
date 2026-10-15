import Menu from "./Menu";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";
import WhiteBoard from "./WhiteBoard";


import { Line, Rectangle, Circle } from "./Canvas";
import { useState } from "react";

export default function DrawingSpace(){
    const [mode, setMode] = useState("line")

    return(
        <div className="w-100 vh-100 d-flex flex-column overflow-hidden">
            <Menu/>
            <div className='w-100 flex-grow-1 gap-1 p-1 bg-dark d-flex overflow-hidden'>
                <Toolbar mode={mode} setMode={(e) => setMode(e)}/>
                <div className='bg-light m-3 d-flex flex-grow-1 overflow-hidden'>
                    <WhiteBoard mode={mode}/>
                </div>
            </div>
        </div>
    )
}