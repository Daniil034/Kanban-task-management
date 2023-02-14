import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBoardAction, editBoardAction } from "../features/boardsSlice";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  selectColumnsById,
  selectColumnsAllIds,
} from "../features/columnsSlice";
import BoardAddEditContainer from "../containers/BoardAddEditContainer";
import "../UI/boardAddEdit.scss";
import Overlay from "./Overlay";

export default function BoardAddEdit({ setShowAddBoardModal }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentBoard } = { ...useOutletContext() };
  const boardColumns = useSelector(selectColumnsById);
  const boardColumnsIds = useSelector(selectColumnsAllIds);
  const [name, setName] = useState(currentBoard?.name || "");
  const [columns, setColumns] = useState(
    currentBoard
      ? boardColumnsIds.map((id) => boardColumns[id])
      : [{ name: "" }]
  );
  const [columnsToDelete, setColumnsToDelete] = useState([]);
  const [savePending, setSavePending] = useState(false);

  const handleColumnInput = (e, i) => {
    setColumns(
      columns.map((column, index) => {
        if (index !== i) return column;
        return { ...column, name: e.target.value };
      })
    );
  };

  const addNewColumn = (e) => {
    e.preventDefault();
    setColumns(columns.concat([{ name: "" }]));
  };

  const deleteColumn = (i) => {
    columns[i].id && setColumnsToDelete((prev) => [...prev, columns[i]]);
    setColumns((prev) => [...prev.slice(0, i), ...prev.slice(i + 1)]);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const columnsToRename = [];
    const columnsToAdd = [];

    // deciding if a column should be delited or updated
    columns.forEach((column) => {
      if (column.id) {
        const boardColumn = boardColumns[column.id];
        const checkColumn = column.name.trim() === boardColumn.name;
        if (!checkColumn) {
          columnsToRename.push(column);
        }
      } else {
        columnsToAdd.push(column);
      }
    });

    // deciding if a board should be deleted or updated
    const shouldUpdate =
      name !== currentBoard.name ||
      columnsToRename.length ||
      columnsToAdd.length ||
      columnsToDelete.length;

    if (shouldUpdate && !savePending) {
      setSavePending(true);
      await dispatch(
        editBoardAction(
          currentBoard.id,
          name,
          columnsToRename,
          columnsToAdd,
          columnsToDelete
        )
      );
      setSavePending(false);
      if (name !== currentBoard.name) {
        navigate(`./${name}`);
      }
    }
    navigate(`/boards/${name}`);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!savePending) {
      setSavePending(true);
      const trimmedColumns = columns.map((column) => ({
        ...column,
        name: column.name.trim(),
      }));
      await dispatch(addBoardAction(name, trimmedColumns));
      setSavePending(false);
      setShowAddBoardModal(false);
      navigate(`./${name}`);
    }
  };

  return (
    <Overlay
      action={() =>
        currentBoard
          ? navigate(`/boards/${currentBoard.name}`)
          : setShowAddBoardModal(false)
      }
    >
      <BoardAddEditContainer
        currentBoard={currentBoard}
        handleEdit={handleEdit}
        handleAdd={handleAdd}
        name={name}
        setName={setName}
        columns={columns}
        handleColumnInput={handleColumnInput}
        deleteColumn={deleteColumn}
        addNewColumn={addNewColumn}
      />
    </Overlay>
  );
}
