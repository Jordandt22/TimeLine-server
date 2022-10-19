const User = require("../../models/user/user.model");
const { USER_KEY } = require("../../redis/redis.keys");
const { getCache, cacheData } = require("../../redis/redis.mw");
const { createError } = require("../../utils/global.utils");
const { verifyAccessToken } = require("../../firebase/firebase.functions");

module.exports = {
  authUser: (isSignUp) => async (req, res, next) => {
    const { fbID } = req.params;

    // FIREBASE AUTH
    const accessToken = req.headers.authorization.replace("Bearer ", "");
    if (!accessToken)
      return res
        .status(422)
        .json(createError(422, "Must provide credentials."));

    const decodedToken = await verifyAccessToken(accessToken);
    if (fbID !== decodedToken?.uid)
      return res
        .status(401)
        .json(createError(401, "Must provide valid credentials."));

    // Is Sign Up Flow
    if (isSignUp) {
      req.user = { fbID };
      return next();
    }

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
