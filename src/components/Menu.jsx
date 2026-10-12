import { Navbar, Nav, Container, Button } from "react-bootstrap";

export default function Menu(){


    return(<>
        <Navbar bg="dark">
            <Container className="d-flex mx-2">
                <div className="d-flex justify-content-start gap-2">
                    <Button variant="outline-light">Settings</Button>
                </div>
            </Container>
        </Navbar>
    </>)
}