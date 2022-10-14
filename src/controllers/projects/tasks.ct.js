const Project = require("../../models/project/project.model");
const { createError } = require("../../utils/global.utils");
const { cacheData, removeCacheData } = require("../../redis/redis.mw");
const { PROJECT_KEY, USER_PROJECTS_KEY } = require("../../redis/redis.keys");

// Check Task
const checkTask = (tasks, taskID) => tasks.some((task) => task._id === taskID);

module.exports = {
  createTask: async (req, res, next) => {
    const { fbID } = req.user;
    const { tasks, _id: projectID } = req.project;
    const { name, desc } = req.body;

    // Create Task
    const updatedProject = await Project.findOneAndUpdate(
      {
        $and: [{ creatorFbID: fbID }, { _id: projectID }],
      },
      {
        tasks: [...tasks, { name, desc, status: {} }],
      },
      { returnDocument: "after" }
    );

    await cacheData(PROJECT_KEY, { projectID }, updatedProject);
    await removeCacheData(USER_PROJECTS_KEY, { fbID });
    return res.status(200).json({ project: updatedProject });
  },
  updateTask: async (req, res, next) => {
    const { fbID } = req.user;
    const { tasks, _id: projectID } = req.project;
    const { taskID } = req.params;
    const { name, desc, status } = req.body;

    // Checking if Task Exists
    const taskExist = checkTask(tasks, taskID);
    if (!taskExist)
      return res.status(404).json(createError(404, "This task doesn't exist."));

    // Updating Task
    const updatedProject = await Project.findOneAndUpdate(
      {
        $and: [{ creatorFbID: fbID }, { _id: projectID }],
      },
      {
        tasks: [...tasks].map((task) => {
          if (task._id === taskID) task = { ...task, name, desc, status };

          return task;
        }),
      },
      { returnDocument: "after" }
    );

    await cacheData(PROJECT_KEY, { projectID }, updatedProject);
    await removeCacheData(USER_PROJECTS_KEY, { fbID });
    return res.status(200).json({ project: updatedProject });
  },
  deleteTask: async (req, res, next) => {
    const { fbID } = req.user;
    const { tasks, _id: projectID } = req.project;
    const { taskID } = req.params;

    // Checking if Task Exists
    const taskExist = checkTask(tasks, taskID);
    if (!taskExist)
      return res.status(404).json(createError(404, "This task doesn't exist."));

    // Updating Task
    const updatedProject = await Project.findOneAndUpdate(
      {
        $and: [{ creatorFbID: fbID }, { _id: projectID }],
      },
      {
        tasks: [...tasks].filter((task) => task._id !== taskID),
      },
      { returnDocument: "after" }
    );

    await cacheData(PROJECT_KEY, { projectID }, updatedProject);
    await removeCacheData(USER_PROJECTS_KEY, { fbID });
    return res.status(200).json({ project: updatedProject });
  },
};
