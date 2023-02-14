import { API_ENDPOINT } from ".";

// update subtask status
export const updateSubtaskStatusAPI = async (
  boardId,
  taskId,
  subtaskId,
  status
) => {
  try {
    const response = await fetch(
      `${API_ENDPOINT}/boards/${boardId}/tasks/${taskId}/subtasks/${subtaskId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );
    return response;
  } catch (err) {
    return err;
  }
};
