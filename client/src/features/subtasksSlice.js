import { combineReducers } from "redux";
import { updateSubtaskStatusAPI } from "../api/subtasks";
import { StatusState, TasksActionTypes, SubtasksActionTypes } from "./types";

// BY ID SLICE

const loadSubtasksEntry = (payload) => {
  const subtasks = {};
  payload.tasks?.forEach((task) =>
    task.subtasks.forEach((subtask) => (subtasks[subtask.id] = subtask))
  );
  return subtasks;
};

const addUpdateSubtasks = (state, array) => {
  const newState = { ...state };
  array.forEach((s) => (newState[s.id] = s));
  return { ...state, ...newState };
};

const deleteArrayOfSubtasks = (state, arrayToDelete) => {
  const newState = {};
  for (const id in state) {
    if (!arrayToDelete.includes(Number(id))) {
      newState[id] = state[id];
    }
  }
  return newState;
};

const subtasksById = (state = {}, action) => {
  const { payload } = action;
  switch (action.type) {
    case TasksActionTypes.FETCH_TASKS_FULFILLED:
      return loadSubtasksEntry(payload);

    case SubtasksActionTypes.UPDATE_SUBTASK_STATUS_FULFILLED: {
      const { subtaskId, status } = payload;
      return {
        ...state,
        [subtaskId]: { ...state[subtaskId], completed: status },
      };
    }

    case TasksActionTypes.CREATE_TASK_FULFILLED: {
      const { subtasks } = payload;
      return addUpdateSubtasks(state, subtasks);
    }

    case TasksActionTypes.UPDATE_TASK_CONTENT_FULFILLED: {
      const { subtasksToInsert, subtasksToUpdate, subtasksToDelete } = payload;
      const subtasksToDeleteIds = subtasksToDelete.map((s) => s.id);
      const afterDeletion = deleteArrayOfSubtasks(state, subtasksToDeleteIds);
      const afterUpdating = addUpdateSubtasks(afterDeletion, subtasksToUpdate);
      const afterInsertion = addUpdateSubtasks(afterUpdating, subtasksToInsert);
      return afterInsertion;
    }

    case TasksActionTypes.DELETE_TASK_FULFILLED: {
      const afterDeletion = deleteArrayOfSubtasks(state, payload.task.subtasks);
      return afterDeletion;
    }

    default:
      return state;
  }
};

// ALL IDS SLICE

const loadSubtasksIds = (payload) => {
  const subtasksIds = [];
  payload.tasks?.forEach((task) =>
    task.subtasks.forEach((subtask) => subtasksIds.push(subtask.id))
  );
  return subtasksIds;
};

const addSubtasksIds = (state, payload) => {
  const { subtasks } = payload;
  const Ids = subtasks.map((s) => s.id);
  return [...state, ...Ids];
};

const deleteSubtasksIds = (state, arrayToDelete) => {
  const newState = [];
  state.forEach((id) => {
    if (!arrayToDelete.includes(id)) newState.push(id);
  });
  return newState;
};

const updateSubtasksIds = (state, payload) => {
  const { subtasksToInsert, subtasksToDelete } = payload;
  const subtasksToDeleteIds = subtasksToDelete.map((s) => s.id);
  const afterDeletion = deleteSubtasksIds(state, subtasksToDeleteIds);

  return [...afterDeletion, ...subtasksToInsert.map((s) => s.id)];
};

const subtasksIds = (state = [], action) => {
  const { payload } = action;
  switch (action.type) {
    case TasksActionTypes.FETCH_TASKS_FULFILLED:
      return loadSubtasksIds(payload);

    case TasksActionTypes.CREATE_TASK_FULFILLED:
      return addSubtasksIds(state, payload);

    case TasksActionTypes.UPDATE_TASK_CONTENT_FULFILLED:
      return updateSubtasksIds(state, payload);

    case TasksActionTypes.DELETE_TASK_FULFILLED:
      return deleteSubtasksIds(state, payload.task.subtasks);

    default:
      return state;
  }
};

// STATUS SLICE

// const subtasksStatus = (state = StatusState.IDLE, action) => {
//   if (
//     action.type === TasksActionTypes.FETCH_TASKS_PENDING ||
//     action.type === SubtasksActionTypes.UPDATE_SUBTASK_STATUS_PENDING
//   )
//     return StatusState.PENDING;
//   if (
//     action.type === TasksActionTypes.FETCH_TASKS_FULFILLED ||
//     action.type === SubtasksActionTypes.UPDATE_SUBTASK_STATUS_FULFILLED
//   )
//     return StatusState.FULFILLED;
//   if (
//     action.type === TasksActionTypes.FETCH_TASKS_REJECTED ||
//     action.type === SubtasksActionTypes.UPDATE_SUBTASK_STATUS_REJECTED
//   )
//     return StatusState.REJECTED;
//   else return state;
// };

// ERROR SLICE

const subtasksError = (state = null, action) => {
  if (action.type === SubtasksActionTypes.UPDATE_SUBTASK_STATUS_REJECTED)
    return action.payload;
  else return null;
};

// COMBINED REDUCER

const subtasksEntities = combineReducers({
  byId: subtasksById,
  allIds: subtasksIds,
});

const subtasksSlice = combineReducers({
  subtasks: subtasksEntities,
  // status: subtasksStatus,
  error: subtasksError,
});

// ACTIONS
export const updateSubtaskStatusAction = (
  boardId,
  taskId,
  subtaskId,
  status
) => {
  return async (dispatch) => {
    dispatch({ type: SubtasksActionTypes.UPDATE_SUBTASK_STATUS_PENDING });
    try {
      await updateSubtaskStatusAPI(boardId, taskId, subtaskId, status);
      dispatch({
        type: SubtasksActionTypes.UPDATE_SUBTASK_STATUS_FULFILLED,
        payload: { subtaskId, status },
      });
    } catch (err) {
      dispatch({
        type: SubtasksActionTypes.UPDATE_SUBTASK_STATUS_REJECTED,
        payload: err.message,
      });
    }
  };
};

// SELECTORS

export const selectSubtasksAllIds = (state) => state.subtasks.subtasks.allIds;

export const selectSubtasksArrayById = (state, idArray) =>
  Object.values(state.subtasks.subtasks.byId).filter((subtask) =>
    idArray.includes(subtask.id)
  );

export default subtasksSlice;
