const statusesRouter = require("express").Router({ mergeParams: true });
const pool = require("../db");

// check status existence
statusesRouter.param("statusId", async (req, res, next, id) => {
  const allStatuses = (
    await pool.query(
      "SELECT status.id FROM status, board WHERE status.board_id = board.id AND board.id = $1",
      [req.boardId]
    )
  ).rows;
  if (allStatuses.findIndex((status) => status.id === Number(id)) === -1) {
    const err = new Error("Status does not exist");
    err.status = 404;
    return next(err);
  }
  req.statusId = id;
  next();
});

// get statuses
// statusesRouter.get("/", async (req, res, next) => {
//   try {
//     const statuses = (
//       await pool.query(
//         "SELECT status.id, status.name FROM status, board WHERE status.board_id = board.id AND board.id = $1",
//         [req.boardId]
//       )
//     ).rows;
//     res.status(200).json(statuses);
//   } catch (err) {
//     return next(err);
//   }
// });

// create a status
statusesRouter.post("/", async (req, res, next) => {
  const { name } = req.body;
  try {
    const newStatus = (
      await pool.query(
        "INSERT INTO status(name, board_id) VALUES ($1, $2) RETURNING id, name, color",
        [name, req.boardId]
      )
    ).rows[0];
    res.status(201).json(newStatus);
  } catch (err) {
    return next(err);
  }
});

// update status color
statusesRouter.put("/:statusId", async (req, res, next) => {
  const { color } = req.body;
  try {
    await pool.query(
      "UPDATE status SET color = $1 WHERE id = $2",
      [color, req.params.statusId]
    );
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
});

// [{columnName, columnId}]
// update statuses names
// statusesRouter.put('/', (req, res, next) => {
//   const statuses = req.body;

// })

// update status' status
// statusesRouter.put("/:statusId", async (req, res, next) => {
//   const { status } = req.body;
//   try {
//     await pool.query(
//       "UPDATE status SET completed = $1 WHERE id = $2",
//       [status, req.statusId]
//     );
//     res.sendStatus(200);
//   } catch (err) {
//     return next(err);
//   }
// });

// // update statuses names
// statusesRouter.put("/", async (req, res, next) => {
//   const { columnsArray } = req.body;
//   const arrayToInsert = [];
//   columnsArray.forEach((status) =>
//     arrayToInsert.push([status.id, status.name])
//   );
//   try {
//     await pool.query(
//       format(
//         "UPDATE status SET name = c.name FROM ( VALUES %L ) AS c(id, name) WHERE status.id = c.id::int",
//         arrayToInsert
//       ),
//       []
//     );
//     res.sendStatus(200);
//   } catch (err) {
//     return next(err);
//   }
// });

// // delete statuses
// statusesRouter.delete("/", async (req, res, next) => {
//   const { columnsArray } = req.body;
//   const arrayToDelete = [];
//   columnsArray.forEach((status) => arrayToDelete.push(status.id));
//   try {
//     await pool.query(
//       format("DELETE FROM status WHERE id IN (%L)", arrayToDelete),
//       []
//     );
//     res.sendStatus(204);
//   } catch (err) {
//     return next(err);
//   }
// });

module.exports = statusesRouter;
