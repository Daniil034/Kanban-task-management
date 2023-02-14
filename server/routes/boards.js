const boardsRouter = require("express").Router();
const pool = require("../db");
const tasksRouter = require("./tasks");
const statusesRouter = require("./statuses");
const format = require("pg-format");

// check id existence
boardsRouter.param("boardId", async (req, res, next, id) => {
  const allBoards = (await pool.query("SELECT * FROM board")).rows;
  if (allBoards.findIndex((board) => board.id === Number(id)) === -1) {
    const err = new Error("Board id does not exist");
    err.status = 404;
    return next(err);
  }
  req.boardId = id;
  next();
});

boardsRouter.use("/:boardId/tasks", tasksRouter);
boardsRouter.use("/:boardId/statuses", statusesRouter);

// get all boards
boardsRouter.get("/", async (req, res, next) => {
  try {
    const allBoards = await pool.query("SELECT * FROM board");
    res.status(200).json(allBoards.rows);
  } catch (err) {
    return next(err);
  }
});

// get a single board info
boardsRouter.get("/:boardId", async (req, res, next) => {
  try {
    const board = await pool.query(
      `
        WITH subtasks AS (
          SELECT
            task_id,
            json_agg(
              json_build_object(
                'id', id,
                'name', name,
                'completed', completed
              )
            ) AS subtasks
          FROM subtask
          GROUP BY 1
        ),
        statuses AS (
          SELECT
            board_id,
            json_agg(
              json_build_object(
                'id', id,
                'name', name,
                'color', color
              )
            ) AS statuses
          FROM status
          GROUP BY 1
        ),
        tasks AS (
          SELECT
            task.board_id,
            json_agg(
              json_build_object(
                'id', task.id,
                'name', task.name,
                'description', task.description,
                'created', task.created,
                'statusId', task.status_id,
                'subtasks', COALESCE (subtasks, '[]')
              )
            ) AS tasks
          FROM task
          LEFT JOIN subtasks ON task.id = subtasks.task_id
          GROUP BY 1
        )
        SELECT
          board.id,
          tasks.tasks,
          statuses.statuses
        FROM board
        LEFT JOIN statuses ON board.id = statuses.board_id
        LEFT JOIN tasks ON board.id = tasks.board_id
        WHERE board.id = $1;
      `,
      [req.boardId]
    );

    res.status(200).json(board.rows[0]);
  } catch (err) {
    return next(err);
  }
});

// create a board with statuses
boardsRouter.post("/", async (req, res, next) => {
  const { name, columnsArrayToInsert } = req.body;

  const arrayToInsert = [];

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const insertBoardText =
      "INSERT INTO board(name) VALUES ($1) RETURNING id, name";
    const newBoard = (await client.query(insertBoardText, [name])).rows[0];

    columnsArrayToInsert.forEach((status) =>
      arrayToInsert.push([status.name, newBoard.id])
    );

    let newStatuses;
    if (arrayToInsert.length) {
      const insertStatusesText =
        "INSERT INTO status(name, board_id) VALUES %L RETURNING id, name";
      newStatuses = (
        await client.query(format(insertStatusesText, arrayToInsert), [])
      ).rows;
    }

    await client.query("COMMIT");
    res.status(200).json(newBoard);
  } catch (err) {
    await client.query("ROLLBACK");
    return next(err);
  } finally {
    client.release();
  }
});

// update a board with statuses
boardsRouter.put("/:boardId", async (req, res, next) => {
  const {
    name,
    columnsArrayToUpdate,
    columnsArrayToInsert,
    columnsArrayToDelete,
  } = req.body;

  const arrayToUpdate = [];
  columnsArrayToUpdate?.forEach((status) =>
    arrayToUpdate.push([status.id, status.name])
  );

  const arrayToInsert = [];
  columnsArrayToInsert?.forEach((status) =>
    arrayToInsert.push([status.name, req.boardId])
  );

  const arrayToDelete = [];
  columnsArrayToDelete?.forEach((status) => arrayToDelete.push(status.id));

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    if (name) {
      const updateBoardText = "UPDATE board SET name = $1 WHERE id = $2";
      await client.query(updateBoardText, [name, req.boardId]);
    }

    let newStatuses;
    if (arrayToInsert.length) {
      const insertStatusesText =
        "INSERT INTO status(name, board_id) VALUES %L RETURNING id, name";
      newStatuses = (
        await client.query(format(insertStatusesText, arrayToInsert), [])
      ).rows;
    }

    if (arrayToUpdate.length) {
      const updateStatusesText =
        "UPDATE status SET name = c.name FROM (VALUES %L) AS c(id, name) WHERE status.id = c.id::int";
      await client.query(format(updateStatusesText, arrayToUpdate), []);
    }

    if (arrayToDelete.length) {
      const deleteStatusesText =
        "DELETE FROM status WHERE id IN (%L) AND board_id = $1";
      await client.query(format(deleteStatusesText, arrayToDelete), [
        req.boardId,
      ]);
    }

    await client.query("COMMIT");
    res.status(200).json(newStatuses || []);
  } catch (err) {
    await client.query("ROLLBACK");
    return next(err);
  } finally {
    client.release();
  }
});

// delete a board with all tasks and statuses
boardsRouter.delete("/:boardId", async (req, res, next) => {
  try {
    await pool.query("DELETE FROM board WHERE id = $1", [req.boardId]);
    res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
});

module.exports = boardsRouter;
