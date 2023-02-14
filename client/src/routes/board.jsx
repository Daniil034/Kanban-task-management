import React, { useEffect, useState } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { Link, Outlet, useOutletContext, useParams } from "react-router-dom";
import {
  fetchTasksAction,
  selectTasksById,
  selectTasksAllIds,
  selectTasksStatus,
} from "../features/tasksSlice";
import {
  selectColumnsById,
  selectColumnsAllIds,
} from "../features/columnsSlice";
import { selectSingleBoardByName } from "../features/boardsSlice";
import { StatusState } from "../features/types";
import TaskTile from "../components/TaskTile";
import ColumnColorModal from "../components/ColumnColorModal";
import "../UI/board.scss";

const Board = () => {
  const { boardName } = useParams();
  const dispatch = useDispatch();
  const boardTasksIds = useSelector(selectTasksAllIds);
  const boardTasks = useSelector(selectTasksById);
  const boardColumnsIds = useSelector(selectColumnsAllIds);
  const boardColumns = useSelector(selectColumnsById);
  const tasksStatus = useSelector(selectTasksStatus);
  const { setCurrentBoard } = useOutletContext();
  const currentBoard = useSelector(
    (state) => selectSingleBoardByName(state, boardName),
    shallowEqual
  );
  const [showChooseColor, setShowChooseColor] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    if (currentBoard) {
      setCurrentBoard(currentBoard);
      dispatch(fetchTasksAction(currentBoard.id, signal));
    }
    return () => {
      controller.abort();
      setCurrentBoard({});
    };
  }, [currentBoard, setCurrentBoard, dispatch]);

  useEffect(() => {
    setShowChooseColor(Array(boardColumnsIds.length).fill(false));
  }, [boardColumnsIds]);

  const handleShowColors = (i) => {
    const newState = showChooseColor.slice();
    newState[i] = !newState[i];
    setShowChooseColor(newState);
  };

  // ======================== CONTENT===================================
  let content;
  const contentFetched = tasksStatus.fetchTasks === StatusState.FULFILLED;
  const columnsExist = boardColumnsIds.length;
  if (contentFetched && columnsExist) {
    content = (
      <>
        {boardColumnsIds.map((cId, i) => (
          <div key={cId} className="board__status-column status-column">
            <div className="status-column__header">
              <div
                className="status-column__header-icon"
                style={{ backgroundColor: boardColumns[cId].color }}
                onClick={() => handleShowColors(i)}
              ></div>
              {showChooseColor[i] && (
                <ColumnColorModal
                  columnIndex={i}
                  handleShowColors={handleShowColors}
                  column={boardColumns[cId]}
                  currentBoard={currentBoard}
                />
              )}
              <h4 className="status-column__header-text">
                {boardColumns[cId].name}
              </h4>
            </div>
            <div className="status-column__tasks">
              {boardTasksIds.map(
                (tId) =>
                  boardTasks[tId].statusId === cId && (
                    <Link to={`tasks/${boardTasks[tId].id}`} key={tId}>
                      <TaskTile task={boardTasks[tId]} />
                    </Link>
                  )
              )}
            </div>
          </div>
        ))}
        <Link className="board__add-column" to={"newColumn"}>
          + New Column
        </Link>
        <Outlet context={{ currentBoard }} />
      </>
    );
  } else if (contentFetched && !columnsExist) {
    content = (
      <div className="board__empty">
        <p className="board__empty-text">
          This board is empty. Create a new column to get started.
        </p>
        <Link className="board__add-column-small" to={"newColumn"}>
          + Add New Column
        </Link>
        <Outlet context={{ currentBoard }} />
      </div>
    );
  } else {
    content = <div className="board__loading">ASDASDASD</div>;
  }

  return (
    <div className="board">
      <div className="board__container">{content}</div>
    </div>
  );
};

export default Board;
