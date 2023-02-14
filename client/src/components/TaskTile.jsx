import React from "react";
import { useSelector } from "react-redux";
import { selectSubtasksArrayById } from "../features/subtasksSlice";
import '../UI/taskTile.scss';

const TaskTile = ({ task }) => {
  const subtasks = useSelector((state) =>
  selectSubtasksArrayById(state, task.subtasks)
  );
  const subtasksNumber = subtasks.length;
  const completedSubtasks = subtasks.filter(
    (subtask) => subtask.completed === true
  ).length;

  return (
    <div className="task-tile">
      <h2 className="task-tile__title">{task.name}</h2>
      <p className="task-tile__subtasks">
        {completedSubtasks} of {subtasksNumber} subtasks
      </p>
    </div>
  );
};

export default TaskTile;
