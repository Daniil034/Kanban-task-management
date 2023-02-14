const tasksRouter = require("express").Router({ mergeParams: true });
const pool = require("../db");
const format = require("pg-format");
const subtasksRouter = require("./subtasks");

// check task existence
tasksRouter.param("taskId", async (req, res, next, id) => {
  const allTasks = (
    await pool.query(
      "SELECT task.id FROM task, board WHERE task.board_id = board.id AND board.id = $1",
      [req.boardId]
    )
  ).rows;
  if (allTasks.findIndex((task) => task.id === Number(id)) === -1) {
    const err = new Error("Task does not exist");
    err.status = 404;
    return next(err);
  }
  req.taskId = id;
  next();
});

tasksRouter.use("/:taskId/subtasks", subtasksRouter);

// create a task
tasksRouter.post("/", async (req, res, next) => {
  const { name, description, statusId, subtasks } = req.body;
  const arrayToInsert = [];
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const insertTaskText = `
      INSERT INTO 
        task(name, description, created, status_id, board_id) 
      VALUES($1, $2, 'now', $3, $4) 
      RETURNING id, name, description, created, status_id AS "statusId"`;

    const newTask = (
      await client.query(insertTaskText, [
        name,
        description,
        statusId,
        req.boardId,
      ])
    ).rows[0];

    subtasks.forEach((s) => arrayToInsert.push([s.name, newTask.id]));

    let newSubtasks = [];
    if (arrayToInsert.length) {
      const insertSubtasksText =
        "INSERT INTO subtask(name, task_id) VALUES %L RETURNING id, name, completed";
      newSubtasks = (
        await client.query(format(insertSubtasksText, arrayToInsert), [])
      ).rows;
    }
    newTask.subtasks = newSubtasks;

    await client.query("COMMIT");
    res.status(200).json(newTask);
  } catch (err) {
    await client.query("ROLLBACK");
    return next(err);
  } finally {
    client.release();
  }
});

// update a task status
tasksRouter.put("/:taskId/changeStatus", async (req, res, next) => {
  const { statusId } = req.body;
  try {
    await pool.query("UPDATE task SET status_id = $1 WHERE id = $2", [
      statusId,
      req.taskId,
    ]);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
});

// update a task
tasksRouter.put("/:taskId", async (req, res, next) => {
  const {
    name,
    description,
    statusId,
    subtasksToInsert,
    subtasksToUpdate,
    subtasksToDelete,
  } = req.body;

  const arrayToUpdate = [];
  subtasksToUpdate?.forEach((s) => arrayToUpdate.push([s.id, s.name]));

  const arrayToInsert = [];
  subtasksToInsert?.forEach((s) => arrayToInsert.push([s.name, req.taskId]));

  const arrayToDelete = [];
  subtasksToDelete?.forEach((s) => arrayToDelete.push(s.id));

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const updateTaskText =
      "UPDATE task SET name = $1, description = $2, status_id = $3 WHERE id = $4";
    await client.query(updateTaskText, [
      name,
      description,
      statusId,
      req.taskId,
    ]);

    let newSubtasks;
    if (arrayToInsert.length) {
      const insertSubtasksText =
        "INSERT INTO subtask(name, task_id) VALUES %L RETURNING id, name, completed";
      newSubtasks = (
        await client.query(format(insertSubtasksText, arrayToInsert), [])
      ).rows;
    }

    if (arrayToUpdate.length) {
      const updateStatusesText =
        "UPDATE subtask SET name = c.name FROM (VALUES %L) AS c(id, name) WHERE subtask.id = c.id::int";
      await client.query(format(updateStatusesText, arrayToUpdate), []);
    }

    if (arrayToDelete.length) {
      const deleteSubtasksText =
        "DELETE FROM subtask WHERE id IN (%L) AND task_id = $1";
      await client.query(format(deleteSubtasksText, arrayToDelete), [
        req.taskId,
      ]);
    }

    await client.query("COMMIT");
    res.status(200).json(newSubtasks || []);
  } catch (err) {
    await client.query("ROLLBACK");
    return next(err);
  } finally {
    client.release();
  }
});

// delete a task
tasksRouter.delete("/:taskId", async (req, res, next) => {
  try {
    await pool.query("DELETE FROM task WHERE id = $1 AND board_id = $2", [req.taskId, req.boardId]);
    res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
});

module.exports = tasksRouter;
