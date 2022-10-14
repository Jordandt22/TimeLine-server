const User = require("../../models/user/user.model");
const Project = require("../../models/project/project.model");
const { createError } = require("../../utils/global.utils");
const { cacheData, removeCacheData } = require("../../redis/redis.mw");
const { USER_KEY, USER_PROJECTS_KEY } = require("../../redis/redis.keys");

module.exports = {
  createUser: async (req, res, next) => {
    const { fbID } = req.user;
    const { firstName, lastName } = req.body;
    const accountAlreadyExists = await User.exists({ fbID });
    if (accountAlreadyExists)
      return res
        .status(200)
        .json(createError(200, `This account has already been created.`));

    // If Account Doesn't Exist
    const user = await User.create({
      fbID,
      firstName,
      lastName,
      projects: [],
    });

    await cacheData(USER_KEY, { fbID }, user);
    return res.status(200).json({ message: "Successfully Created Account." });
  },
  getUser: async (req, res, next) => {
    const { fbID } = req.user;
    const user = req.user;

    await cacheData(USER_KEY, { fbID }, user);
    return res.status(200).json({ user });
  },
  deleteUser: async (req, res, next) => {
    const { fbID } = req.user;
    await User.findOneAndDelete({ fbID });

    await removeCacheData(USER_KEY, { fbID });
    await removeCacheData(USER_PROJECTS_KEY, { fbID });
    return res.status(200).json({ message: "Successfully deleted user." });
  },
  getUserProjects: async (req, res, next) => {
    const { fbID, projects } = req.user;

    // Getting Database data and combining it with User data.
    const dbProjects = await Project.find({ creatorFbID: fbID });
    const combinedData = dbProjects.map((dbProj) => {
      const data = projects.filter(
        (userProj) => userProj.projectID === dbProj._id.toString()
      )[0];
      return {
        ...data,
        ...dbProj._doc,
      };
    });

    await cacheData(USER_PROJECTS_KEY, { fbID }, combinedData);
    return res.status(200).json({ projects: combinedData });
  },
};
