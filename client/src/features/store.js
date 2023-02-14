import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import boardsReducer from "../features/boardsSlice";
import tasksReducer from "./tasksSlice";
import subtasksReducer from "./subtasksSlice";
import columnsReducer from "./columnsSlice";

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware));

const store = createStore(
  combineReducers({
    boards: boardsReducer,
    tasks: tasksReducer,
    subtasks: subtasksReducer,
    columns: columnsReducer,
  }),
  composedEnhancer
);

export default store;
