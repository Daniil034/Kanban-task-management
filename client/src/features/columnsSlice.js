import { combineReducers } from "redux";
import { addColumnAPI, editColumnColorAPI } from "../api/columns";
import {
  ColumnsActionTypes,
  TasksActionTypes,
  BoardsActionTypes,
} from "./types";

// BY ID SLICE

const loadColumnsEntry = (payload) => {
  const columns = {};
  payload.statuses?.forEach((status) => (columns[status.id] = status));
  return columns;
};

const editColumns = (state, payload) => {
  const { columnsArrayToUpdate, columnsArrayToInsert, columnsArrayToDelete } =
    payload;
  let newState = {};
  const columnsArrayToDeleteIds = columnsArrayToDelete.map(
    (column) => column.id
  );
  for (const id in state) {
    if (!columnsArrayToDeleteIds.includes(Number(id))) {
      newState[id] = state[id];
    }
  }
  columnsArrayToUpdate.forEach(
    (column) => (newState = { ...newState, [column.id]: column })
  );
  columnsArrayToInsert.forEach(
    (column) => (newState = { ...newState, [column.id]: column })
  );
  return newState;
};

const findEntity = (state, value) => {
  const entity = Object.values(state).find((entity) => entity.id === value);
  return entity;
};

const updateColor = (state, payload) => {
  const { color, columnId } = payload;
  const columnToUpdate = findEntity(state, columnId);
  return { ...state, [columnToUpdate.id]: { ...columnToUpdate, color } };
};

const columnsById = (state = {}, action) => {
  const { payload } = action;
  switch (action.type) {
    case TasksActionTypes.FETCH_TASKS_FULFILLED:
      return loadColumnsEntry(payload);

    case BoardsActionTypes.EDIT_BOARD_FULFILLED:
      return editColumns(state, payload);

    case BoardsActionTypes.DELETE_BOARD_FULFILLED:
      return {};

    case ColumnsActionTypes.ADD_COLUMN_FULFILLED:
      return { ...state, [payload.id]: payload };

    case ColumnsActionTypes.CHANGE_COLUMN_COLOR_FULFILLED:
      return updateColor(state, payload);

    default:
      return state;
  }
};

// ALL IDS SLICE

const loadColumnsIds = (payload) => {
  const columns = [];
  payload.statuses?.forEach((status) => columns.push(status.id));
  return columns.sort();
};

const editColumnsIds = (state, payload) => {
  const { columnsArrayToInsert, columnsArrayToDelete } = payload;
  const newState = [];
  const columnsArrayToDeleteIds = columnsArrayToDelete.map(
    (column) => column.id
  );
  state.forEach((id) => {
    if (!columnsArrayToDeleteIds.includes(id)) newState.push(id);
  });

  return [...newState, ...columnsArrayToInsert.map((column) => column.id)];
};

const columnsAllIds = (state = [], action) => {
  const { payload } = action;
  switch (action.type) {
    case TasksActionTypes.FETCH_TASKS_FULFILLED:
      return loadColumnsIds(payload);
    case BoardsActionTypes.EDIT_BOARD_FULFILLED:
      return editColumnsIds(state, payload);
    case BoardsActionTypes.DELETE_BOARD_FULFILLED:
      return [];
    case ColumnsActionTypes.ADD_COLUMN_FULFILLED:
      return [...state, payload.id];
    default:
      return state;
  }
};

// STATUS SLICE

// const columnsStatus = (state = StatusState.IDLE, action) => {
//   if (
//     action.type === TasksActionTypes.FETCH_TASKS_PENDING ||
//     action.type === ColumnsActionTypes.ADD_COLUMN_PENDING ||
//     action.type === BoardsActionTypes.EDIT_BOARD_PENDING ||
//     action.type === BoardsActionTypes.DELETE_BOARD_PENDING
//   )
//     return StatusState.PENDING;
//   else if (
//     action.type === TasksActionTypes.FETCH_TASKS_FULFILLED ||
//     action.type === ColumnsActionTypes.ADD_COLUMN_FULFILLED ||
//     action.type === BoardsActionTypes.EDIT_BOARD_FULFILLED ||
//     action.type === BoardsActionTypes.DELETE_BOARD_FULFILLED
//   )
//     return StatusState.FULFILLED;
//   else if (
//     action.type === TasksActionTypes.FETCH_TASKS_REJECTED ||
//     action.type === ColumnsActionTypes.ADD_COLUMN_REJECTED ||
//     action.type === BoardsActionTypes.EDIT_BOARD_REJECTED ||
//     action.type === BoardsActionTypes.DELETE_BOARD_REJECTED
//   )
//     return StatusState.REJECTED;
//   else return state;
// };

// ERROR SLICE

const columnsError = (state = null, action) => {
  if (
    action.type === ColumnsActionTypes.ADD_COLUMN_REJECTED ||
    action.type === ColumnsActionTypes.CHANGE_COLUMN_COLOR_REJECTED
  )
    return action.payload;
  else return null;
};

// COMBINED REDUCER

const columnsEntities = combineReducers({
  byId: columnsById,
  allIds: columnsAllIds,
});

const columnsSlice = combineReducers({
  columns: columnsEntities,
  // status: columnsStatus,
  error: columnsError,
});

// ACTIONS

export const addColumnAction = (boardId, columnName, closeModal) => {
  return async (dispatch) => {
    dispatch({ type: ColumnsActionTypes.ADD_COLUMN_PENDING });
    try {
      const newColumn = await addColumnAPI(boardId, columnName);
      dispatch({
        type: ColumnsActionTypes.ADD_COLUMN_FULFILLED,
        payload: newColumn,
      });
      closeModal();
    } catch (err) {
      dispatch({
        type: ColumnsActionTypes.ADD_COLUMN_REJECTED,
        payload: err.message,
      });
    }
  };
};

export const updateColumnColorAction = (boardId, columnId, color) => {
  return async (dispatch) => {
    dispatch({ type: ColumnsActionTypes.CHANGE_COLUMN_COLOR_PENDING });
    try {
      await editColumnColorAPI(boardId, columnId, color);
      dispatch({
        type: ColumnsActionTypes.CHANGE_COLUMN_COLOR_FULFILLED,
        payload: { color, columnId },
      });
    } catch (err) {
      dispatch({
        type: ColumnsActionTypes.CHANGE_COLUMN_COLOR_REJECTED,
        payload: err.message,
      });
    }
  };
};

// SELECTORS

export const selectColumnsById = (state) => state.columns.columns.byId;
export const selectColumnsAllIds = (state) => state.columns.columns.allIds;
export const selectColumnsError = (state) => state.columns.error;

export default columnsSlice;
