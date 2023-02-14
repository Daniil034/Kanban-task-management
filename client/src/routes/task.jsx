import React, { useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import {
  selectSingleTaskById,
  updateTaskStatusAction,
} from "../features/tasksSlice";
import Overlay from "../components/Overlay";
import {
  selectSubtasksArrayById,
  updateSubtaskStatusAction,
} from "../features/subtasksSlice";
import {
  selectColumnsAllIds,
  selectColumnsById,
} from "../features/columnsSlice";
import TaskContainer from "../containers/TaskContainer";

const Task = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { taskId } = useParams();
  const { currentBoard } = useOutletContext();
  const task = useSelector(
    (state) => selectSingleTaskById(state, taskId),
    shallowEqual
  );

  const [showSideButtons, setShowSideButtons] = useState(false);
  const subtasks = useSelector(
    (state) => selectSubtasksArrayById(state, task?.subtasks || []),
    shallowEqual
  );
  const boardColumns = useSelector(selectColumnsById);
  const boardColumnsIds = useSelector(selectColumnsAllIds);
  const completedSubtasks = subtasks.filter(
    (subtask) => subtask.completed
  ).length;

  const options = boardColumnsIds.map((id) => ({
    value: boardColumns[id],
    label: boardColumns[id].name,
  }));

  const defaultOption = options.find(
    (option) => option.value.id === boardColumns[task.statusId].id
  );

  const changeSubtaskStatus = (i) => {
    dispatch(
      updateSubtaskStatusAction(
        currentBoard.id,
        task.id,
        subtasks[i].id,
        !subtasks[i].completed
      )
    );
  };

  const changeTaskStatus = (e) => {
    dispatch(updateTaskStatusAction(currentBoard.id, task.id, e.value.id));
  };

  const handleEditClick = () => {
    navigate("./edit");
  };

  const handleDeleteClick = () => {
    navigate("./delete");
  };

  return (
    <>
      <Overlay action={() => navigate(`/boards/${currentBoard.name}`)}>
        <TaskContainer
          task={task}
          showSideButtons={showSideButtons}
          setShowSideButtons={setShowSideButtons}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
          subtasks={subtasks}
          completedSubtasks={completedSubtasks}
          changeSubtaskStatus={changeSubtaskStatus}
          changeTaskStatus={changeTaskStatus}
          options={options}
          defaultOption={defaultOption}
        />
      </Overlay>
    </>
  );
};

export default Task;
