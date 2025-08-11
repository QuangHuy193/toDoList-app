const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const validateDeadline = require("../middlewares/validateDeadline");
const {
  createTask,
  updateTask,
  updateTaskStatus,
  readTask,
  deleteTask,
} = require("../controllers/task.controller");

router.post("/create", authMiddleware, validateDeadline, createTask);

router.get("/read", authMiddleware, readTask);

router.put("/update/:id", authMiddleware, validateDeadline, updateTask);
router.patch("/update-status/:id", authMiddleware, updateTaskStatus);

router.delete("/delete/:id", authMiddleware, deleteTask);

module.exports = router;
