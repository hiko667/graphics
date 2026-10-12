import './App.css'
import { useState } from 'react'
import DrawingSpace from './components/DrawingSpace'
import Toolbar from './components/Toolbar'
import Canvas from './components/Canvas'
import { Line } from './components/Canvas'
import Menu from './components/Menu'
export default function App() {
    const [mode, setMode] = useState("line")
    return (
        <>
            <Menu/>
            <div className='h-100 w-100 gap-1 p-3 bg-dark d-flex'>
                <Toolbar mode={mode} setMode={(e) => setMode(e)}/>
                <div className='bg-light border rounded-1 m-3 d-flex flex-row'
                    style={{
                        maxHeight : "100%",
                        maxWidth : "100%"
                    }}
                    >
                    {/* <DrawingSpace mode={mode}/> */}
                    <Canvas className = "w-100 h-100">
                        <Line x={1} y={12} vx={100} vy={100} width={10}/>
                    </Canvas>
                </div>
            </div>
        </>
    )
}
