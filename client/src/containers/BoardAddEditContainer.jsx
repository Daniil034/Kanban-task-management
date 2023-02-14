import { ReactComponent as IconCross } from "../assets/icon-cross.svg";

const placeholders = ["Todo", "Doing", "Done"];
const randomPlaceholder = () => {
  return placeholders[Math.floor(Math.random() * placeholders.length)];
};

const BoardAddEditContainer = ({
  currentBoard,
  handleEdit,
  handleAdd,
  name,
  setName,
  columns,
  handleColumnInput,
  deleteColumn,
  addNewColumn,
}) => {
  return (
    <div className="edit-board-modal">
      <form
        className="edit-board-modal__form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={currentBoard ? handleEdit : handleAdd}
      >
        <h3 className="edit-board-modal__header">
          {currentBoard ? "Edit" : "Add new"} Board
        </h3>
        <div className="edit-board-modal__name">
          <h4 className="edit-board-modal__name-text">Board Name</h4>
          <input
            className="edit-board-modal__name-input"
            type="text"
            value={name}
            required
            placeholder="e.g. Web Design"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="edit-board-modal__columns">
          <h4 className="edit-board-modal__columns-text">Board Columns</h4>
          <ul className="edit-board-modal__columns-list">
            {columns.map((column, i) => (
              <div className="edit-board-modal__columns-item" key={i}>
                <input
                  className="edit-board-modal__columns-input"
                  type="text"
                  value={column.name}
                  required
                  placeholder={randomPlaceholder()}
                  onChange={(e) => handleColumnInput(e, i)}
                />
                <button
                  className="edit-board-modal__columns-delete"
                  type="button"
                  onClick={() => deleteColumn(i)}
                >
                  <IconCross />
                </button>
              </div>
            ))}
          </ul>
          <button
            className="edit-board-modal__columns-add"
            onClick={addNewColumn}
          >
            Add New Column
          </button>
        </div>
        <button className="edit-board-modal__save" type="submit">
          {currentBoard ? "Save changes" : "Create New Board"}
        </button>
      </form>
    </div>
  );
};

export default BoardAddEditContainer;
