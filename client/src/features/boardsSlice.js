import { combineReducers } from "redux";
import { getBoardsAPI } from "../api/boards";
import { addBoardAPI, editBoardAPI, deleteBoardAPI } from "../api/boards";
import { BoardsActionTypes, StatusState } from "./types";

// BY ID SLICE

const loadBoardsEntry = (payload) => {
  const boards = {};
  payload.forEach((board) => (boards[board.id] = board));
  return boards;
};

const findEntity = (state, value) => {
  const entity = Object.values(state).find((entity) => entity.id === value);
  return entity;
};

const deleteBoard = (state, payload) => {
  const { id } = payload;
  const { [id]: value, ...rest } = state;
  return rest;
};

const editBoard = (state, payload) => {
  const { id, name } = payload;
  const boardToEdit = findEntity(state, id);
  return { ...state, [boardToEdit.id]: { ...boardToEdit, name: name } };
};

const boardsById = (state = {}, action) => {
  const { payload } = action;
  switch (action.type) {
    case BoardsActionTypes.FETCH_BOARDS_FULFILLED:
      return loadBoardsEntry(payload);

    case BoardsActionTypes.ADD_BOARD_FULFILLED:
      return { ...state, [payload.id]: payload };

    case BoardsActionTypes.EDIT_BOARD_FULFILLED:
      return editBoard(state, payload);

    case BoardsActionTypes.DELETE_BOARD_FULFILLED:
      return deleteBoard(state, payload);

    default:
      return state;
  }
};

// ALL IDS SLICE

const loadBoardsIds = (payload) => {
  const boards = [];
  payload.forEach((board) => boards.push(board.id));
  return boards.sort((a, b) => a - b);
};

const addBoardId = (state, payload) => {
  const { id } = payload;
  return [...state, id];
};

const deleteBoardId = (state, payload) => {
  const { id } = payload;
  const index = state.findIndex((el) => el === id);
  return [...state.slice(0, index), ...state.slice(index + 1)];
};

const boardsAllIds = (state = [], action) => {
  const { payload } = action;
  switch (action.type) {
    case BoardsActionTypes.FETCH_BOARDS_FULFILLED:
      return loadBoardsIds(payload);

    case BoardsActionTypes.ADD_BOARD_FULFILLED:
      return addBoardId(state, payload);

    case BoardsActionTypes.DELETE_BOARD_FULFILLED:
      return deleteBoardId(state, payload);

    default:
      return state;
  }
};

// STATUS SLICE

const boardsStatus = (state = StatusState.IDLE, action) => {
  if (action.type === BoardsActionTypes.FETCH_BOARDS_PENDING)
    return StatusState.PENDING;
  else if (action.type === BoardsActionTypes.FETCH_BOARDS_FULFILLED)
    return StatusState.FULFILLED;
  else if (action.type === BoardsActionTypes.FETCH_BOARDS_REJECTED)
    return StatusState.REJECTED;
  else return state;
};

// ERROR SLICE

const boardError = (state = null, action) => {
  if (
    action.type === BoardsActionTypes.FETCH_BOARDS_REJECTED ||
    action.type === BoardsActionTypes.ADD_BOARD_REJECTED ||
    action.type === BoardsActionTypes.EDIT_BOARD_REJECTED ||
    action.type === BoardsActionTypes.DELETE_BOARD_REJECTED
  )
    return action.payload;
  else return null;
};

// COMBINED REDUCERS

const boardsEntities = combineReducers({
  byId: boardsById,
  allIds: boardsAllIds,
});

const boardsSlice = combineReducers({
  boards: boardsEntities,
  status: boardsStatus,
  error: boardError,
});

// ACTIONS

export const fetchBoardsAction = async (dispatch) => {
  dispatch({ type: BoardsActionTypes.FETCH_BOARDS_PENDING });
  try {
    const boards = await getBoardsAPI();
    dispatch({
      type: BoardsActionTypes.FETCH_BOARDS_FULFILLED,
      payload: boards,
    });
  } catch (err) {
    dispatch({
      type: BoardsActionTypes.FETCH_BOARDS_REJECTED,
      payload: err.message,
    });
  }
};

export const addBoardAction = (boardName, columnsArray) => {
  return async (dispatch) => {
    dispatch({ type: BoardsActionTypes.ADD_BOARD_PENDING });
    try {
      const board = await addBoardAPI(boardName, columnsArray);
      dispatch({
        type: BoardsActionTypes.ADD_BOARD_FULFILLED,
        payload: board,
      });
    } catch (err) {
      dispatch({
        type: BoardsActionTypes.ADD_BOARD_REJECTED,
        payload: err.message,
      });
    }
  };
};

export const editBoardAction = (
  id,
  name,
  columnsArrayToUpdate,
  columnsArrayToInsert,
  columnsArrayToDelete
) => {
  return async (dispatch) => {
    dispatch({ type: BoardsActionTypes.EDIT_BOARD_PENDING });
    try {
      const newStatuses = await editBoardAPI(
        id,
        name,
        columnsArrayToUpdate,
        columnsArrayToInsert,
        columnsArrayToDelete
      );
      dispatch({
        type: BoardsActionTypes.EDIT_BOARD_FULFILLED,
        payload: {
          id,
          name,
          columnsArrayToUpdate,
          columnsArrayToInsert: newStatuses,
          columnsArrayToDelete,
        },
      });
    } catch (err) {
      dispatch({
        type: BoardsActionTypes.EDIT_BOARD_REJECTED,
        payload: err.message,
      });
    }
  };
};

export const deleteBoardAction = (id, navigate) => {
  return async (dispatch) => {
    dispatch({ type: BoardsActionTypes.DELETE_BOARD_PENDING });
    try {
      await deleteBoardAPI(id);
      dispatch({
        type: BoardsActionTypes.DELETE_BOARD_FULFILLED,
        payload: { id },
      });
      navigate("/boards");
    } catch (err) {
      dispatch({
        type: BoardsActionTypes.DELETE_BOARD_REJECTED,
        payload: err.message,
      });
    }
  };
};

// SELECTORS

export const selectBoardsById = (state) => state.boards.boards.byId;
export const selectSingleBoardByName = (state, name) =>
  Object.values(state.boards.boards.byId).find((board) => board.name === name);
export const selectBoardsAllIds = (state) => state.boards.boards.allIds;
export const selectBoardsStatus = (state) => state.boards.status;

export default boardsSlice;
