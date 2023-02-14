const subtasksRouter = require("express").Router({ mergeParams: true });
const pool = require("../db");

// check subtask existence
subtasksRouter.param("subtaskId", async (req, res, next, id) => {
  const allSubtasks = (
    await pool.query(
      "SELECT subtask.id FROM subtask, task, board WHERE subtask.task_id = task.id AND task.id = $1 AND board.id = $2",
      [req.taskId, req.boardId]
    )
  ).rows;
  if (allSubtasks.findIndex((subtask) => subtask.id === Number(id)) === -1) {
    const err = new Error("Subtask does not exist");
    err.status = 404;
    return next(err);
  }
  req.subtaskId = id;
  next();
});

// create a subtask
subtasksRouter.post("/", async (req, res, next) => {
  const { name } = req.body;
  try {
    const newSubtask = (
      await pool.query(
        "INSERT INTO subtask(name, task_id) VALUES ($1, $2) RETURNING *",
        [name, req.taskId]
      )
    ).rows[0];
    res.status(201).json(newSubtask);
  } catch (err) {
    return next(err);
  }
});

// update a subtask status
subtasksRouter.put("/:subtaskId", async (req, res, next) => {
  const { status } = req.body;
  try {
    await pool.query("UPDATE subtask SET completed = $1 WHERE id = $2", [
      status,
      req.subtaskId,
    ]);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
});

// delete a subtask
subtasksRouter.delete("/:subtaskId", async (req, res, next) => {
  try {
    await pool.query("DELETE FROM subtask WHERE id = $1", [
      req.subtaskId,
    ]);
    res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
});

module.exports = subtasksRouter;
