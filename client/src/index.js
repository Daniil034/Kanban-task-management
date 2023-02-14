import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import store from "./features/store";
import { Provider } from "react-redux";
import { fetchBoardsAction } from "./features/boardsSlice";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import Board from "./routes/board";
import Task from "./routes/task";
import IndexRoute from "./routes/indexRoute";
import TaskAddEdit from "./components/TaskAddEdit";
import BoardAddEdit from "./components/BoardAddEdit";
import DeleteModal from "./components/DeleteModal";
import ColumnAdd from "./components/ColumnAdd";
import "./UI/reset.scss";
import "./index.scss";

const router = createBrowserRouter([
  {
    path: "/boards",
    element: <Root />,
    children: [
      { index: true, element: <IndexRoute /> },
      {
        path: "/boards/:boardName",
        element: <Board />,
        children: [
          {
            path: "edit",
            element: <BoardAddEdit />,
          },
          {
            path: "delete",
            element: <DeleteModal />,
          },
          {
            path: "tasks/new",
            element: <TaskAddEdit />,
          },
          {
            path: "tasks/:taskId",
            element: <Task />,
          },
          {
            path: "tasks/:taskId/edit",
            element: <TaskAddEdit />,
          },
          {
            path: "tasks/:taskId/delete",
            element: <DeleteModal />,
          },
          {
            path: "newColumn",
            element: <ColumnAdd />,
          },
        ],
      },
    ],
  },
]);

store.dispatch(fetchBoardsAction);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
