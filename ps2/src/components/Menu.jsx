import Button from 'react-bootstrap/Button';
import { FilePlus2Icon } from 'lucide-react';

export default function Menu(){

    return(
        <div className="h-100 d-flex align-items-center m-3" style={{
            width : "5%",
        }}>
        
            <div style={{
                width : "100%",
                height : "90%"
            }}
            className="bg-white d-flex align-items-center flex-column gap-3 justify-content-center p-3 rounded">
                <Button>
                    <FilePlus2Icon/>
                </Button>
                
            </div>
        </div>
    )

}