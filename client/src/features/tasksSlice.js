import { combineReducers } from "redux";
import { getSingleBoardAPI } from "../api/boards";
import {
  createTaskAPI,
  deleteTaskAPI,
  updateTaskAPI,
  updateTaskStatusAPI,
} from "../api/tasks";
import { StatusState, TasksActionTypes } from "./types";

// BY ID SLICE

const loadTasksEntry = (payload) => {
  const tasks = {};
  payload.tasks?.forEach((task) => {
    const subtasks = task.subtasks.map((s) => s.id);
    tasks[task.id] = { ...task, subtasks };
  });
  return tasks;
};

const findEntity = (state, value) => {
  const entity = Object.values(state).find((entity) => entity.id === value);
  return entity;
};

const updateStatus = (state, payload) => {
  const { taskId, statusId } = payload;
  const taskToEdit = findEntity(state, taskId);
  return { ...state, [taskToEdit.id]: { ...taskToEdit, statusId: statusId } };
};

const addTask = (state, payload) => {
  const newSubtasksIds = payload.subtasks?.map((s) => s.id);
  return { ...state, [payload.id]: { ...payload, subtasks: newSubtasksIds } };
};

const updateContent = (state, payload) => {
  const {
    taskId,
    name,
    description,
    statusId,
    subtasksToDelete,
    subtasksToInsert,
  } = payload;
  const taskToEdit = findEntity(state, taskId);
  const taskSubtasks = [...taskToEdit.subtasks];
  const subtasksToInsertIds = subtasksToInsert?.map((s) => s.id);
  const subtasksToDeleteIds = subtasksToDelete?.map((s) => s.id);
  taskSubtasks.forEach((s, i) => {
    if (subtasksToDeleteIds.includes(s)) taskSubtasks.splice(i, 1);
  });
  return {
    ...state,
    [taskToEdit.id]: {
      ...taskToEdit,
      name,
      description,
      statusId,
      subtasks: [...taskSubtasks.concat(subtasksToInsertIds)],
    },
  };
};

const deleteTask = (state, taskId) => {
  const newState = { ...state };
  delete newState[taskId];
  return newState;
};

const tasksById = (state = {}, action) => {
  const { payload } = action;
  switch (action.type) {
    case TasksActionTypes.FETCH_TASKS_FULFILLED:
      return loadTasksEntry(payload);

    case TasksActionTypes.UPDATE_TASK_STATUS_FULFILLED:
      return updateStatus(state, payload);

    case TasksActionTypes.CREATE_TASK_FULFILLED:
      return addTask(state, payload);

    case TasksActionTypes.UPDATE_TASK_CONTENT_FULFILLED:
      return updateContent(state, payload);

    case TasksActionTypes.DELETE_TASK_FULFILLED:
      return deleteTask(state, payload.task.id);

    default:
      return state;
  }
};

// ALL IDS SLICE

const loadTasksIds = (payload) => {
  const tasksIds = [];
  payload.tasks?.forEach((t) => tasksIds.push(t.id));
  return tasksIds;
};

const tasksIds = (state = [], action) => {
  const { payload } = action;
  switch (action.type) {
    case TasksActionTypes.FETCH_TASKS_FULFILLED:
      return loadTasksIds(payload);

    case TasksActionTypes.CREATE_TASK_FULFILLED:
      return [...state, payload.id];

    case TasksActionTypes.DELETE_TASK_FULFILLED: {
      const taskIndex = state.findIndex((id) => id === payload.task.id);
      return [...state.slice(0, taskIndex), ...state.slice(taskIndex + 1)];
    }

    default:
      return state;
  }
};

// STATUS SLICE

const statusInitialState = {
  fetchTasks: StatusState.IDLE,
  createTask: StatusState.IDLE,
  updateTaskStatus: StatusState.IDLE,
  updateTaskContent: StatusState.IDLE,
  deleteTask: StatusState.IDLE,
};

const tasksStatus = (state = statusInitialState, action) => {
  switch (action.type) {
    case TasksActionTypes.FETCH_TASKS_PENDING:
      return { ...state, fetchTasks: StatusState.PENDING };

    case TasksActionTypes.FETCH_TASKS_FULFILLED:
      return { ...state, fetchTasks: StatusState.FULFILLED };

    case TasksActionTypes.FETCH_TASKS_REJECTED:
      return { ...state, fetchTasks: StatusState.REJECTED };

    default:
      return state;
  }
};

// ERROR SLICE

const tasksError = (state = null, action) => {
  if (
    action.type === TasksActionTypes.FETCH_TASKS_REJECTED ||
    action.type === TasksActionTypes.CREATE_TASK_REJECTED ||
    action.type === TasksActionTypes.UPDATE_TASK_STATUS_REJECTED ||
    action.type === TasksActionTypes.UPDATE_TASK_CONTENT_REJECTED ||
    action.type === TasksActionTypes.DELETE_TASK_REJECTED
  )
    return action.payload;
  else return null;
};

// COMBINED REDUCER

const tasksEntities = combineReducers({
  byId: tasksById,
  allIds: tasksIds,
});

const tasksSlice = combineReducers({
  tasks: tasksEntities,
  status: tasksStatus,
  error: tasksError,
});

// ACTIONS

export const fetchTasksAction = (boardId, signal) => {
  return async (dispatch) => {
    dispatch({ type: TasksActionTypes.FETCH_TASKS_PENDING });
    try {
      const boardInfo = await getSingleBoardAPI(boardId, signal);
      dispatch({
        type: TasksActionTypes.FETCH_TASKS_FULFILLED,
        payload: boardInfo,
      });
    } catch (err) {
      dispatch({
        type: TasksActionTypes.FETCH_TASKS_REJECTED,
        payload: err.message,
      });
    }
  };
};

export const createTaskAction = (
  boardId,
  name,
  description,
  statusId,
  subtasks
) => {
  return async (dispatch) => {
    dispatch({type: TasksActionTypes.CREATE_TASK_PENDING});
    try {
      const response = await createTaskAPI(
        boardId,
        name,
        description,
        statusId,
        subtasks
      );
      dispatch({
        type: TasksActionTypes.CREATE_TASK_FULFILLED,
        payload: response,
      });
    } catch (err) {
      dispatch({
        type: TasksActionTypes.CREATE_TASK_REJECTED,
        payload: err.message,
      });
    }
  };
};

export const updateTaskStatusAction = (boardId, taskId, statusId) => {
  return async (dispatch) => {
    dispatch({type: TasksActionTypes.UPDATE_TASK_CONTENT_PENDING});
    try {
      await updateTaskStatusAPI(boardId, taskId, statusId);
      dispatch({
        type: TasksActionTypes.UPDATE_TASK_STATUS_FULFILLED,
        payload: { taskId, statusId },
      });
    } catch (err) {
      dispatch({
        type: TasksActionTypes.UPDATE_TASK_STATUS_REJECTED,
        payload: err.message,
      });
    }
  };
};

export const updateTaskContentAction = (
  boardId,
  taskId,
  name,
  description,
  statusId,
  subtasksToInsert,
  subtasksToUpdate,
  subtasksToDelete
) => {
  return async (dispatch) => {
    dispatch({type: TasksActionTypes.UPDATE_TASK_CONTENT_PENDING});
    try {
      const response = await updateTaskAPI(
        boardId,
        taskId,
        name,
        description,
        statusId,
        subtasksToInsert,
        subtasksToUpdate,
        subtasksToDelete
      );
      dispatch({
        type: TasksActionTypes.UPDATE_TASK_CONTENT_FULFILLED,
        payload: {
          taskId,
          name,
          description,
          statusId,
          subtasksToInsert: response,
          subtasksToUpdate,
          subtasksToDelete,
        },
      });
    } catch (err) {
      dispatch({
        type: TasksActionTypes.UPDATE_TASK_CONTENT_REJECTED,
        payload: err.message,
      });
    }
  };
};

export const deleteTaskAction = (currentBoard, task, navigate) => {
  return async (dispatch) => {
    dispatch({type: TasksActionTypes.DELETE_TASK_PENDING});
    try {
      await deleteTaskAPI(currentBoard.id, task.id);
      dispatch({
        type: TasksActionTypes.DELETE_TASK_FULFILLED,
        payload: { task },
      });
      navigate(`/boards/${currentBoard.name}`);
    } catch (err) {
      dispatch({
        type: TasksActionTypes.DELETE_TASK_REJECTED,
        payload: err.message,
      });
    }
  };
};

// SELECTORS

export const selectTasksById = (state) => state.tasks.tasks.byId;
export const selectTasksAllIds = (state) => state.tasks.tasks.allIds;
export const selectTasksStatus = (state) => state.tasks.status;
export const selectSingleTaskById = (state, id) =>
  Object.values(state.tasks.tasks.byId).find((task) => task.id == id);

export default tasksSlice;
