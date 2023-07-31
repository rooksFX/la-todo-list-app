import './modal.scss'

const Modal = ({ children }: { children: JSX.Element }) => {

    return (
        <>
            <div className="modal-slot">
                <div className="modal">
                    <>
                        { children }
                    </>
                </div>
            </div>
        </>
    )
}

export default Modal