import './App.css'
import { useState } from 'react'
import DrawingSpace from './components/DrawingSpace'
import Toolbar from './components/Toolbar'

export default function App() {
    const [mode, setMode] = useState("line")
    return (
        <>
            <div className='h-100 w-100 bg-dark d-flex'>
                <div className='bg-light border rounded-1 m-3 d-flex flex-row'
                    style={{
                        maxHeight : "100%",
                        maxWidth : "100%"
                    }}
                    >
                    <Toolbar mode={mode} setMode={(e) => setMode(e)}/>
                    <DrawingSpace mode={mode}/></div>
            </div>
        </>
    )
}
