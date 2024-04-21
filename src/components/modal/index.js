import React from "react";
import * as ReactModal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width:"500px",
  
  },
};

ReactModal.setAppElement("#root");

export default function Modal({ isOpen, setIsOpen, label, content }) {
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
        {content}
      </ReactModal>
    </div>
  );
}
