import { API_ENDPOINT } from ".";

// get all board names
export const getBoardsAPI = async () => {
  const response = await fetch(`${API_ENDPOINT}/boards/`);
  const allBoards = await response.json();
  return allBoards;
};

// get single board info
export const getSingleBoardAPI = async (id, signal) => {
  const response = await fetch(`${API_ENDPOINT}/boards/${id}`, {signal});
  const board = await response.json();
  return board;
};

// create a new board with statuses
export const addBoardAPI = async (boardName, columnsArray) => {
  const response = await fetch(`${API_ENDPOINT}/boards/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: boardName,
      columnsArrayToInsert: columnsArray,
    }),
  });
  const newBoard = await response.json();
  return newBoard;
};

// edit board
export const editBoardAPI = async (
  id,
  name,
  columnsArrayToUpdate,
  columnsArrayToInsert,
  columnsArrayToDelete
) => {
  const response = await fetch(`${API_ENDPOINT}/boards/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      columnsArrayToUpdate,
      columnsArrayToInsert,
      columnsArrayToDelete,
    }),
  });
  const newColumns = await response.json();
  return newColumns;
};

// delete a board with all tasks
export const deleteBoardAPI = async (id) => {
  const response = await fetch(`${API_ENDPOINT}/boards/${id}`, {
    method: "DELETE",
  });
  return response;
};
