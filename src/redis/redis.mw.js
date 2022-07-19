const redis = require("./redis");

// Format Redis Keys
const formatRedisKey = (key, reqParams) => {
  const { name, params } = key;
  let redisKey = name;
  params.map((param) => {
    const val = reqParams[param];
    if (!val) return;

    redisKey = redisKey + "_" + param + ":" + val.trim();
  });

  return redisKey.trim().toLowerCase();
};

module.exports = {
  // Middleware
  getCacheData: (key) => async (req, res, next) => {
    const redisKey = formatRedisKey(key, {
      fbId: req.user ? req.user.fbId : null,
      ...req.params,
      ...req.body,
    });
    const data = await redis.get(redisKey);

    // Checking if there is a callback for a certain redis key
    if (key.callback) return key.callback(req, res, next, data);

    // Checking if Data exists
    if (!data) return next();

    const cachedData = JSON.parse(data);
    req[key.name] = cachedData;
    next();
  },
  // Functions
  cacheData: async (key, reqParams, data) =>
    await redis.set(formatRedisKey(key, reqParams), JSON.stringify(data), {
      EX: key.expiresIn,
    }),
  removeCacheData: async (key, reqParams) =>
    await redis.del(formatRedisKey(key, reqParams)),
  getCache: async (key, reqParams) => {
    const data = await redis.get(formatRedisKey(key, reqParams));
    return JSON.parse(data);
  },
};
