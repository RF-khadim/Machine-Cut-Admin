import React from "react";
import * as ReactModal from "react-modal";
import './styles.css'

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
    },
};

ReactModal.setAppElement("#root");

export default function ConfirmationModal({ isOpen, setIsOpen, label, message, yesClick, noClick ,yesTitle}) {
    function closeModal() {
        setIsOpen(false);
    }

    return (
        <div>
            <ReactModal
                isOpen={isOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel={label}
            >
                <p>{message}</p>
                <div className="modal-controls">

                    <button onClick={yesClick} type="submit" id="yes-btn">
                        {yesTitle}
                    </button>
                    <button onClick={noClick} type="submit" id="no-btn">
                        No
                    </button>
                </div>
            </ReactModal>
        </div>
    );
}
