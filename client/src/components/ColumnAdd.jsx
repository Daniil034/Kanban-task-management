import { useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addColumnAction, selectColumnsError } from "../features/columnsSlice";
import Overlay from "./Overlay";
import "../UI/columnAdd.scss";

const ColumnAdd = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentBoard } = useOutletContext();
  const [pending, setPending] = useState(false);
  const columnName = useRef(null);
  const addColumnError = useSelector(selectColumnsError);

  const handleClose = () => {
    navigate(`/boards/${currentBoard.name}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pending) {
      setPending(true);
      await dispatch(
        addColumnAction(currentBoard.id, columnName.current, handleClose)
      );
      setPending(false);
    }
  };

  return (
    <Overlay action={() => navigate(`/boards/${currentBoard.name}`)}>
      <form
        className="column-add"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="column-add__header">
          <h3 className="column-add__header-text">Add New Column</h3>
          {addColumnError && (
            <p className="column-add__header-error">
              {addColumnError ===
              'duplicate key value violates unique constraint "status_name_board_id_key"'
                ? "Name already exists"
                : "Something went wrong"}
            </p>
          )}
        </div>
        <div className="column-add__name">
          <h3 className="column-add__name-text">Column name</h3>
          <input
            className="column-add__name-input"
            type="text"
            required
            onChange={(e) => (columnName.current = e.target.value)}
          />
        </div>
        <button className="column-add__save" type="submit">
          Create New Column
        </button>
      </form>
    </Overlay>
  );
};

export default ColumnAdd;
