const Project = require("../../models/project/project.model");
const { createError } = require("../../utils/global.utils");
const { cacheData } = require("../../redis/redis.mw");
const { PROJECT_KEY } = require("../../redis/redis.keys");

module.exports = {
  checkProject: async (req, res, next) => {
    const { fbID } = req.user;
    const { projectID } = req.params;
    const cachedProject = req.project;
    if (cachedProject) {
      // Checking if the User is the Creator
      const { creatorFbID } = cachedProject;
      if (creatorFbID !== fbID)
        return res
          .status(403)
          .json(createError(403, "You don't have access to this project."));

      return next();
    }

    // Getting Project Data
    const dbProject = await Project.findOne({
      $and: [{ creatorFbID: fbID }, { _id: projectID }],
    });
    if (!dbProject)
      return res.status(404).json(createError(404, "Unable to find project."));

    req.project = dbProject;
    await cacheData(PROJECT_KEY, { projectID }, dbProject);
    return next();
  },
};
