const tasksRouter = require("express-promise-router")();
const {
  createTask,
  updateTask,
  deleteTask,
} = require("../../controllers/projects/tasks.ct");
const {
  bodyValidator,
  TaskSchema,
  UpdateTaskSchema,
} = require("../../validation/body.validator");
const {
  paramsValidator,
  TaskIDSchema,
} = require("../../validation/params.validator");

// Tasks API

// POST - Create Task
tasksRouter.post("/", bodyValidator(TaskSchema), createTask);

// PATCH - Update task
tasksRouter.patch(
  "/:taskID",
  paramsValidator(TaskIDSchema),
  bodyValidator(UpdateTaskSchema),
  updateTask
);

// DELETE - Delete task
tasksRouter.delete("/:taskID", paramsValidator(TaskIDSchema), deleteTask);

module.exports = tasksRouter;
