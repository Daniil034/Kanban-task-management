import React, { useState, useRef, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  selectColumnsAllIds,
  selectColumnsById,
} from "../features/columnsSlice";
import { selectSubtasksArrayById } from "../features/subtasksSlice";
import {
  createTaskAction,
  selectSingleTaskById,
  updateTaskContentAction,
} from "../features/tasksSlice";
import TaskAddEditContainer from "../containers/TaskAddEditContainer";
import "../UI/taskAddEdit.scss";
import { useNavigate, useParams } from "react-router-dom";
import { selectSingleBoardByName } from "../features/boardsSlice";
import Overlay from "./Overlay";

const TaskAddEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { boardName, taskId } = useParams();
  const task = useSelector(
    (state) => selectSingleTaskById(state, taskId),
    shallowEqual
  );
  const currentBoard = useSelector((state) =>
    selectSingleBoardByName(state, boardName)
  );
  const boardColumns = useSelector(selectColumnsById);
  const boardColumnsIds = useSelector(selectColumnsAllIds);
  const [taskName, setTaskName] = useState(task?.name || "");
  const [description, setDescription] = useState(task?.description || "");
  const taskSubtasks = useSelector(
    (state) => selectSubtasksArrayById(state, task?.subtasks || []),
    shallowEqual
  );
  const [subtasks, setSubtasks] = useState(
    task ? taskSubtasks : [{ name: "" }]
  );
  const [taskStatus, setTaskStatus] = useState(
    task ? boardColumns[task.statusId] : boardColumns[boardColumnsIds[0]]
  );
  const [subtasksToDelete, setSubtasksToDelete] = useState([]);
  const textAreaRef = useRef(null);

  // description section height
  useEffect(() => {
    textAreaRef.current.style.height = "112px";
    const scrollHeight = textAreaRef.current.scrollHeight;
    textAreaRef.current.style.height = scrollHeight + "px";
  }, [description]);

  // options for React-select
  const options = boardColumnsIds.map((id) => ({
    value: boardColumns[id],
    label: boardColumns[id].name,
  }));

  // default option
  const defaultOption = task
    ? options.find(
        (option) => option.value.id === boardColumns[task.statusId].id
      )
    : options.find(
        (option) => option.value.id === boardColumns[boardColumnsIds[0]].id
      );

  const handleSubtaskInput = (e, i) => {
    setSubtasks(
      subtasks.map((subtask, index) => {
        if (index !== i) return subtask;
        return { ...subtask, name: e.target.value };
      })
    );
  };

  const handleChangeStatus = (e) => {
    setTaskStatus({ id: e.value.id, name: e.value.name });
  };

  // case handle submit for ADD TASK purpose
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    console.log(currentBoard);
    await dispatch(
      createTaskAction(
        currentBoard.id,
        taskName,
        description,
        taskStatus.id,
        subtasks
      )
    );
    navigate(`/boards/${currentBoard.name}`);
  };

  // case handle submit for EDIT TASK purpose
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const subtasksToRename = [];
    const subtasksToAdd = [];

    // deciding if a subtask should be deleted or updated
    subtasks.forEach((s) => {
      if (s.id) {
        const taskSubtask = taskSubtasks.find((ts) => ts.id === s.id);
        const checkSubtask = s.name.trim() === taskSubtask.name;
        if (!checkSubtask) {
          subtasksToRename.push(s);
        }
      } else {
        subtasksToAdd.push(s);
      }
    });

    // deciding if a task should be updated
    const shouldUpdate =
      taskName !== task.name ||
      taskStatus.id !== task.statusId ||
      task.description !== description ||
      subtasksToRename.length ||
      subtasksToAdd.length ||
      subtasksToDelete.length;

    if (shouldUpdate) {
      await dispatch(
        updateTaskContentAction(
          currentBoard.id,
          task.id,
          taskName,
          description,
          taskStatus.id,
          subtasksToAdd,
          subtasksToRename,
          subtasksToDelete
        )
      );
    }
    navigate(`/boards/${currentBoard.name}/tasks/${task.id}`);
  };

  const addNewSubtask = () => {
    setSubtasks(subtasks.concat({ name: "" }));
  };

  // remove from state and add a subtask to 'to be deleted' array to send to the server
  const deleteSubtask = (i) => {
    subtasks[i].id && setSubtasksToDelete((prev) => [...prev, subtasks[i]]);
    setSubtasks((prev) => [...prev.slice(0, i), ...prev.slice(i + 1)]);
  };

  return (
    <Overlay action={() => navigate(`/boards/${currentBoard.name}`)}>
      <TaskAddEditContainer
        task={task}
        handleEditSubmit={handleEditSubmit}
        handleAddSubmit={handleAddSubmit}
        taskName={taskName}
        setTaskName={setTaskName}
        description={description}
        setDescription={setDescription}
        subtasks={subtasks}
        handleSubtaskInput={handleSubtaskInput}
        deleteSubtask={deleteSubtask}
        addNewSubtask={addNewSubtask}
        handleChangeStatus={handleChangeStatus}
        options={options}
        defaultOption={defaultOption}
        textAreaRef={textAreaRef}
      />
    </Overlay>
  );
};

export default TaskAddEdit;
