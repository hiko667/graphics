import { Modal } from "react-bootstrap";


export default function ErrorModal({show, onHide, errorMessage}){

    return(
        <Modal show= {show} onHide={onHide}>
            <Modal.Header>
                <h1>You got an error!</h1>
            </Modal.Header>
            <Modal.Body>
                <p>
                    {errorMessage.messgae}
                </p>
            </Modal.Body>
        </Modal>
    )
}