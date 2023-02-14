import { useRef } from "react";
import { CSSTransition } from "react-transition-group";
import "../UI/modalButtons.scss";

const ModalButtons = ({
  parent,
  setShowSideButtons,
  editAction,
  deleteAction,
  showSideButtons,
}) => {
  const modalButtonsRef = useRef(null);

  const handleEditClick = () => {
    editAction();
    setShowSideButtons(false);
  };

  const handleDeleteClick = () => {
    deleteAction();
    setShowSideButtons(false);
  };

  return (
    <CSSTransition
      in={showSideButtons}
      nodeRef={modalButtonsRef}
      timeout={300}
      classNames="modal-buttons"
      unmountOnExit
    >
      <div className="modal-buttons" ref={modalButtonsRef}>
        <div
          className="modal-buttons__buttons"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="modal-buttons__edit"
            onClick={handleEditClick}
          >
            Edit {parent}
          </button>
          <button
            type="button"
            className="modal-buttons__delete"
            onClick={handleDeleteClick}
          >
            Delete {parent}
          </button>
        </div>
        <div
          className="modal-buttons__overlay"
          onClick={() => setShowSideButtons(false)}
        ></div>
      </div>
    </CSSTransition>
  );
};

export default ModalButtons;
