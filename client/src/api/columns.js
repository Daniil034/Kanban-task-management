import { API_ENDPOINT } from ".";

// get all columns
export const getColumnsAPI = async (boardId) => {
  const response = await fetch(`${API_ENDPOINT}/boards/${boardId}/statuses`);
  const columns = await response.json();
  return columns;
};

// create a column
export const addColumnAPI = async (boardId, columnName) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/boards/${boardId}/statuses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: columnName }),
    });
    const json = await response.json();
    if(!response.ok) {
      throw new Error(json.error);
    }
    return json;
  } catch (err) {
    throw err;
  }
};

// // update a column color
export const editColumnColorAPI = async (boardId, columnId, color) => {
  const response = await fetch(
    `${API_ENDPOINT}/boards/${boardId}/statuses/${columnId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ color }),
    }
  );
  return response;
};
