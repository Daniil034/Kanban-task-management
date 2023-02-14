import { API_ENDPOINT } from ".";

// get all tasks
export const getTasksAPI = async (boardId) => {
  const response = await fetch(`${API_ENDPOINT}/boards/${boardId}/tasks`);
  const tasks = await response.json();
  return tasks;
};

// create a task
export const createTaskAPI = async (
  boardId,
  name,
  description,
  statusId,
  subtasks
) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/boards/${boardId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, statusId, subtasks }),
    });
    const task = await response.json();
    return task;
  } catch (err) {
    return err;
  }
};

// change task status
export const updateTaskStatusAPI = async (boardId, taskId, statusId) => {
  try {
    const response = await fetch(
      `${API_ENDPOINT}/boards/${boardId}/tasks/${taskId}/changeStatus`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusId }),
      }
    );
    return response;
  } catch (err) {
    return err;
  }
};

// update a task
export const updateTaskAPI = async (
  boardId,
  taskId,
  name,
  description,
  statusId,
  subtasksToInsert,
  subtasksToUpdate,
  subtasksToDelete
) => {
  try {
    const response = await fetch(
      `${API_ENDPOINT}/boards/${boardId}/tasks/${taskId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          statusId,
          subtasksToInsert,
          subtasksToUpdate,
          subtasksToDelete,
        }),
      }
    );
    return await response.json();
  } catch (err) {
    return err;
  }
};

// delete a task
export const deleteTaskAPI = async (boardId, taskId) => {
  try {
    await fetch(`${API_ENDPOINT}/boards/${boardId}/tasks/${taskId}`, {
      method: "DELETE",
    });
  } catch (err) {
    return err;
  }
};
