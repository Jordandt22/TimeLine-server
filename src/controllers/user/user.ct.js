const User = require("../../models/user/user.model");
const { createError } = require("../../utils/global.utils");
const { cacheData, removeCacheData } = require("../../redis/redis.mw");
const { USER_KEY } = require("../../redis/redis.keys");

module.exports = {
  createUser: async (req, res, next) => {
    const { fbID, firstName, lastName } = req.body;
    const accountAlreadyExists = await User.exists({ fbID });
    if (accountAlreadyExists)
      return res
        .status(400)
        .json(createError(400, `This account already exists.`));

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
    const cacheUser = req.user;
    if (cacheUser) return res.status(200).json({ user: cacheUser });

    const { fbID } = req.params;
    const user = await User.findOne({ fbID });
    if (!user)
      return res.status(404).json(createError(404, "Unable to find user."));

    await cacheData(USER_KEY, { fbID }, user);
    return res.status(200).json({ user });
  },
  deleteUser: async (req, res, next) => {
    const { fbID } = req.params;
    await User.findOneAndDelete({ fbID });

    await removeCacheData(USER_KEY, { fbID });
    return res.status(200).json({ message: "Successfully deleted user." });
  },
};
