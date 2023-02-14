import { useDispatch } from "react-redux";
import { updateColumnColorAction } from "../features/columnsSlice";
import "../UI/columnColorModal.scss";

const colors = [
  "#49C4E5",
  "#8471F2",
  "#67E2AE",
  "#f50b78",
  "#0026ff",
  "#f7c331",
];

const ColumnColorModal = ({
  handleShowColors,
  column,
  columnIndex,
  currentBoard,
}) => {
  const dispatch = useDispatch();

  const handleOverlayClick = () => {
    handleShowColors(columnIndex);
  };

  const handleColorClick = (i) => {
    column.color !== colors[i] &&
      dispatch(updateColumnColorAction(currentBoard.id, column.id, colors[i]));
    handleShowColors(columnIndex);
  };

  return (
    <>
      <div className="column-color-modal">
        {colors.map((c, i) => (
          <div
            className="column-color-modal__circle"
            key={i}
            style={{ backgroundColor: c }}
            onClick={() => handleColorClick(i)}
          ></div>
        ))}
      </div>
      <div className="column-color-overlay" onClick={handleOverlayClick}></div>
    </>
  );
};

export default ColumnColorModal;
