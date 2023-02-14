import ModalButtons from "../components/ModalButtons";
import { ReactComponent as IconDots } from "../assets/icon-vertical-ellipsis.svg";
import "../UI/task.scss";
import SelectColumn from "../components/SelectColumn";

const TaskContainer = ({ task,
    showSideButtons,
    setShowSideButtons,
    handleEditClick,
    handleDeleteClick,
    subtasks,
    completedSubtasks,
    changeSubtaskStatus,
    changeTaskStatus,
    defaultOption,
    options,}) => {

        
  return (
    <div className="task" onClick={(e) => e.stopPropagation()}>
      <div className="task__header">
        <h3 className="task__header-title">{task.name}</h3>
        <button
          type="button"
          className="task__header-buttons"
          onClick={() => {
            setShowSideButtons(true);
          }}
        >
          <IconDots />
        </button>
          <ModalButtons
          showSideButtons={showSideButtons}
            parent={"Task"}
            setShowSideButtons={setShowSideButtons}
            editAction={handleEditClick}
            deleteAction={handleDeleteClick}
          />
      </div>
      {task.description && (
        <p className="task__description">{task.description}</p>
      )}
      <form className="task__form">
        {subtasks.length > 0 && (
          <div className="task__subtasks">
            <h4 className="task__subtasks-title">
              Subtasks {completedSubtasks} of {subtasks.length}
            </h4>
            <ul className="task__subtasks-list">
              {subtasks.map((subtask, i) => {
                return (
                  <li className="task__subtasks-item" key={subtask.id}>
                    <label
                      className={
                        subtasks[i].completed
                          ? "task__subtasks-label task__subtasks-label--checked"
                          : "task__subtasks-label"
                      }
                    >
                      <input
                        type="checkbox"
                        checked={subtasks[i].completed}
                        onChange={() => changeSubtaskStatus(i)}
                      />
                      <span className="task__subtasks-input"></span>
                      {subtask.name}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <div className="task__status">
          <h4 className="task__status-title">Current Status</h4>
          <SelectColumn
            options={options}
            defaultOption={defaultOption}
            action={changeTaskStatus}
          />
        </div>
      </form>
    </div>
  )
}

export default TaskContainer