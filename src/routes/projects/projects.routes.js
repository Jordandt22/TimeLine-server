const projectsRouter = require("express-promise-router")();
const {
  createProject,
  getProject,
  updateProject,
  deleteProject,
} = require("../../controllers/projects/projects.ct");
const {
  bodyValidator,
  ProjectSchema,
  UpdateProjectSchema,
} = require("../../validation/body.validator");
const {
  paramsValidator,
  ProjectIDSchema,
} = require("../../validation/params.validator");
const { getCacheData } = require("../../redis/redis.mw");
const { PROJECT_KEY } = require("../../redis/redis.keys");

// Projects API

// POST - Create a Project
projectsRouter.post("/", bodyValidator(ProjectSchema), createProject);

// GET - Get a Project
projectsRouter.get(
  "/:projectID",
  paramsValidator(ProjectIDSchema),
  getCacheData(PROJECT_KEY),
  getProject
);

// PATCH - Update a Project
projectsRouter.patch(
  "/:projectID",
  paramsValidator(ProjectIDSchema),
  bodyValidator(UpdateProjectSchema),
  updateProject
);

// DELETE - Remove a Project
projectsRouter.delete(
  "/:projectID",
  paramsValidator(ProjectIDSchema),
  deleteProject
);

module.exports = projectsRouter;
