import { ReactComponent as IconCross } from "../assets/icon-cross.svg";
import SelectColumn from "../components/SelectColumn";

const TaskAddEditContainer = ({
  task,
  handleEditSubmit,
  handleAddSubmit,
  taskName,
  setTaskName,
  description,
  setDescription,
  subtasks,
  handleSubtaskInput,
  deleteSubtask,
  addNewSubtask,
  options,
  defaultOption,
  handleChangeStatus,
  textAreaRef,
}) => {
  return (
    <form
      className="task-edit-modal"
      onClick={(e) => e.stopPropagation()}
      onSubmit={task ? handleEditSubmit : handleAddSubmit}
    >
      <h3 className="task-edit-modal__header">
        {task ? "Edit" : "Add New"} Task
      </h3>
      <div className="task-edit-modal__title">
        <h4 className="task-edit-modal__title-header">Title</h4>
        <input
          type="text"
          className="task-edit-modal__title-input"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
        />
      </div>
      <div className="task-edit-modal__description">
        <h4 className="task-edit-modal__description-header">Description</h4>
        <textarea
          className="task-edit-modal__description-input"
          ref={textAreaRef}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <div className="task-edit-modal__subtasks">
        <h4 className="task-edit-modal__subtasks-title">Subtasks</h4>
        <ul className="task-edit-modal__subtasks-list">
          {subtasks.map((subtask, i) => (
            <li className="task-edit-modal__subtasks-item" key={i}>
              <input
                className="task-edit-modal__subtasks-input"
                type="text"
                value={subtask.name}
                required
                onChange={(e) => handleSubtaskInput(e, i)}
              />
              <button
                type="button"
                className="task-edit-modal__subtasks-delete"
                onClick={() => deleteSubtask(i)}
              >
                <IconCross />
              </button>
            </li>
          ))}
        </ul>
        <button
          className="task-edit-modal__add-subtask"
          onClick={addNewSubtask}
        >
          Add subtask
        </button>
      </div>
      <div className="task-edit-modal__status">
        <h4 className="task-edit-modal__status-title">Status</h4>
        <SelectColumn
          options={options}
          action={handleChangeStatus}
          defaultOption={defaultOption}
        />
      </div>
      <button className="task-edit-modal__save" type="submit">
        {task ? "Save changes" : "Create task"}
      </button>
    </form>
  );
};

export default TaskAddEditContainer;
