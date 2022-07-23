const User = require("../../models/user/user.model");
const { USER_KEY } = require("../../redis/redis.keys");
const { getCache, cacheData } = require("../../redis/redis.mw");
const { createError } = require("../../utils/global.utils");

module.exports = {
  authUser: async (req, res, next) => {
    const { fbID } = req.params;

    // FIREBASE AUTH

    // Retrieve User Data
    const cachedUser = await getCache(USER_KEY, { fbID });
    if (cachedUser) {
      req.user = cachedUser;
      return next();
    }

    const dbUser = await User.findOne({ fbID });
    if (!dbUser)
      return res.status(404).json(createError(404, "Unable to find user."));

    req.user = dbUser;
    await cacheData(USER_KEY, { fbID }, dbUser);
    return next();
  },
};
