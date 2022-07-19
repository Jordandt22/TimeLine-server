const User = require("../../models/user/user.model");
const { USER_KEY } = require("../../redis/redis.keys");
const { getCache } = require("../../redis/redis.mw");

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
    req.user = dbUser;
    return next();
  },
};
