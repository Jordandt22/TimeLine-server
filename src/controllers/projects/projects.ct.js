const User = require("../../models/user/user.model");
const Project = require("../../models/project/project.model");
const { cacheData, removeCacheData } = require("../../redis/redis.mw");
const { USER_KEY, PROJECT_KEY } = require("../../redis/redis.keys");
const { createError } = require("../../utils/global.utils");

// Update Project's Last Viewed in User's List
const updateProjectLastViewed = async ({ fbID, projects }, projectID) => {
  const updatedUser = await User.findOneAndUpdate(
    { fbID },
    {
      projects: [...projects].map((proj) => {
        if (proj.projectID === projectID) proj.lastViewed = new Date();

        return proj;
      }),
    },
    { returnDocument: "after" }
  );

  await cacheData(USER_KEY, { fbID }, updatedUser);
  return updatedUser;
};

module.exports = {
  createProject: async (req, res, next) => {
    const user = req.user;
    const fbID = user.fbID;
    const { name, desc } = req.body;

    // Create New Project
    const newProject = await Project.create({
      creatorFbID: fbID,
      name,
      desc,
      task: [],
      status: {},
    });

    // Updating User
    const projectID = newProject._id.toString();
    const updatedUser = await User.findOneAndUpdate(
      { fbID },
      {
        projects: [...user.projects, { creatorFbId: fbID, projectID }],
      },
      { returnDocument: "after" }
    );

    await cacheData(USER_KEY, { fbID }, updatedUser);
    await cacheData(PROJECT_KEY, { projectID }, newProject);
    return res.status(200).json({ project: newProject, user: updatedUser });
  },
  getProject: async (req, res, next) => {
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

      const updatedUser = await updateProjectLastViewed(req.user, projectID);
      return res
        .status(200)
        .json({ project: cachedProject, user: updatedUser });
    }

    // Finding Project
    const project = await Project.findOne({
      $and: [{ creatorFbID: fbID }, { _id: projectID }],
    });
    if (!project)
      return res.status(404).json(createError(404, "Unable to find project."));

    // Update Last Viewed
    const updatedUser = await updateProjectLastViewed(req.user, projectID);

    await cacheData(PROJECT_KEY, { projectID }, project);
    return res.status(200).json({ project, user: updatedUser });
  },
  deleteProject: async (req, res, next) => {
    const { fbID, projects } = req.user;
    const { projectID } = req.params;

    // Deleting Project
    await Project.findOneAndDelete({
      $and: [{ creatorFbID: fbID }, { _id: projectID }],
    });

    // Removing Project from User's List
    const updatedUser = await User.findOneAndUpdate(
      { fbID },
      {
        projects: [...projects].filter((proj) => proj.projectID !== projectID),
      },
      { returnDocument: "after" }
    );

    await removeCacheData(PROJECT_KEY, { projectID });
    await cacheData(USER_KEY, { fbID }, updatedUser);
    return res.status(200).json({ user: updatedUser });
  },
  updateProject: async (req, res, next) => {
    const { fbID } = req.user;
    const { projectID } = req.params;
    const { name, desc, status } = req.body;
    const updatedProject = await Project.findOneAndUpdate(
      {
        $and: [{ creatorFbID: fbID }, { _id: projectID }],
      },
      { name, desc, status },
      { returnDocument: "after" }
    );

    await cacheData(PROJECT_KEY, { projectID }, updatedProject);
    return res.status(200).json({ project: updatedProject });
  },
};
