import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { deleteTaskAction, selectSingleTaskById } from "../features/tasksSlice";
import {
  deleteBoardAction,
  selectSingleBoardByName,
} from "../features/boardsSlice";
import Overlay from "./Overlay";
import "../UI/deleteModal.scss";

const DeleteModal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { boardName, taskId } = useParams();
  const currentBoard = useSelector((state) =>
    selectSingleBoardByName(state, boardName)
  );
  const currentTask = useSelector(
    (state) => selectSingleTaskById(state, taskId),
    shallowEqual
  );
  const [deletePending, setDeletePending] = useState(false);

  const handleDelete = async () => {
    if (!deletePending) {
      setDeletePending(true);
      if (taskId) {
        await dispatch(deleteTaskAction(currentBoard, currentTask, navigate));
      } else {
        await dispatch(deleteBoardAction(currentBoard.id, navigate));
      }
      setDeletePending(false);
    }
  };

  const handleCancel = () => {
    if (taskId)
      navigate(`/boards/${currentBoard.name}/tasks/${currentTask.id}`);
    else navigate(`/boards/${currentBoard.name}`);
  };

  let bodyContent;
  if (taskId) {
    bodyContent = `Are you sure you want to delete the ${currentTask.name} task and its subtasks? This action cannot be reversed.`;
  } else {
    bodyContent = `Are you sure you want to delete the ${boardName} board? This action will remove all columns and tasks and cannot be reversed.`;
  }

  return (
    <Overlay action={() => navigate(`/boards/${currentBoard.name}`)}>
      <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="delete-modal__header">
          Delete this {taskId ? "task" : "board"}?
        </h3>
        <p className="delete-modal__body">{bodyContent}</p>
        <div className="delete-modal__buttons">
          <button className="delete-modal__delete" onClick={handleDelete}>
            Delete
          </button>
          <button className="delete-modal__cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </Overlay>
  );
};

export default DeleteModal;
