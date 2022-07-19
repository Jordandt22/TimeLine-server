const projectsRouter = require("express-promise-router")();
const { createProject } = require("../../controllers/projects/projects.ct");

// Projects API

// POST - Create a Project
projectsRouter.post("/", createProject);

module.exports = projectsRouter;
