import './modal.scss';

const Modal = ({ children }) => {
  return (
    <div className="modalDiv" id="modalDiv">
      <div className="ModalOverlay" />
      <div className="ModalWrapper">
        <div className="ModalInner" name="content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
