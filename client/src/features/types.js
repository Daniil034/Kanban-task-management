// BOARDS
export const BoardsActionTypes = {
  FETCH_BOARDS_PENDING: "boards/fetchBoards/pending",
  FETCH_BOARDS_FULFILLED: "boards/fetchBoards/fulfilled",
  FETCH_BOARDS_REJECTED: "boards/fetchBoards/rejected",
  ADD_BOARD_PENDING: "boards/addBoard/pending",
  ADD_BOARD_FULFILLED: "boards/addBoard/fulfilled",
  ADD_BOARD_REJECTED: "boards/addBoard/rejected",
  EDIT_BOARD_PENDING: "boards/editBoard/pending",
  EDIT_BOARD_FULFILLED: "boards/editBoard/fulfilled",
  EDIT_BOARD_REJECTED: "boards/editBoard/rejected",
  DELETE_BOARD_PENDING: "boards/deleteBoard/pending",
  DELETE_BOARD_FULFILLED: "boards/deleteBoard/fulfilled",
  DELETE_BOARD_REJECTED: "boards/deleteBoard/rejected",
};

// STATUSES
export const ColumnsActionTypes = {
  ADD_COLUMN_PENDING: "columns/addColumn/pending",
  ADD_COLUMN_FULFILLED: "columns/addColumn/fulfilled",
  ADD_COLUMN_REJECTED: "columns/addColumn/rejected",
  CHANGE_COLUMN_COLOR_PENDING: 'columns/changeColor/pending',
  CHANGE_COLUMN_COLOR_FULFILLED: 'columns/changeColor/fulfilled',
  CHANGE_COLUMN_COLOR_REJECTED: 'columns/changeColor/rejected'
};

// TASKS
export const TasksActionTypes = {
  FETCH_TASKS_PENDING: "tasks/fetchBoardInfo/pending",
  FETCH_TASKS_FULFILLED: "tasks/fetchBoardInfo/fulfilled",
  FETCH_TASKS_REJECTED: "tasks/fetchBoardInfo/rejected",
  CREATE_TASK_PENDING: "tasks/createTask/pending",
  CREATE_TASK_FULFILLED: "tasks/createTask/fulfilled",
  CREATE_TASK_REJECTED: "tasks/createTask/rejected",
  UPDATE_TASK_STATUS_PENDING: "tasks/updateTaskStatus/pending",
  UPDATE_TASK_STATUS_FULFILLED: "tasks/updateTaskStatus/fulfilled",
  UPDATE_TASK_STATUS_REJECTED: "tasks/updateTaskStatus/rejected",
  UPDATE_TASK_CONTENT_PENDING: "tasks/updateTaskContent/pending",
  UPDATE_TASK_CONTENT_FULFILLED: "tasks/updateTaskContent/fulfilled",
  UPDATE_TASK_CONTENT_REJECTED: "tasks/updateTaskContent/rejected",
  DELETE_TASK_PENDING: 'tasks/deleteTask/pending',
  DELETE_TASK_FULFILLED: 'tasks/deleteTask/fulfilled',
  DELETE_TASK_REJECTED: 'tasks/deleteTask/rejected',
};

// SUBTASKS
export const SubtasksActionTypes = {
  UPDATE_SUBTASK_STATUS_PENDING: "subtasks/updateSubtaskStatus/pending",
  UPDATE_SUBTASK_STATUS_FULFILLED: "subtasks/updateSubtaskStatus/fulfilled",
  UPDATE_SUBTASK_STATUS_REJECTED: "subtasks/updateSubtaskStatus/rejected",
};

// STATUS
export const StatusState = {
  IDLE: "idle",
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
};
