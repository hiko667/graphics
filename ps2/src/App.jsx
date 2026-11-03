import { Button } from "react-bootstrap"
import Menu from "./components/Menu"
import { FilePlus2Icon } from "lucide-react"
export default function App(){

    return(
        <>
            <div className="w-100 d-flex gap-1 h-100 bg-dark">
                {/* <Menu/> */}
                <div className = "m-3 d-flex align-items-center flex-column" style={{
                    width : "5%",
                    height : "5%"
                }}>
                    <Button variant="light">
                        <FilePlus2Icon/>
                    </Button>
                
                </div>
            </div>
        </>
    )
}