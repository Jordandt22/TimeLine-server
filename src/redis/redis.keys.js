// const returnCachedData = (req, res, next, data) => {
//   if (!data) return next();

//   const cachedData = JSON.parse(data);
//   return res.status(200).json({ sets: cachedData });
// };

module.exports = {
  USER_KEY: {
    name: "user",
    params: ["fbID"],
    expiresIn: 60 * 60,
  },
  PROJECT_KEY: {
    name: "project",
    params: ["projectID"],
    expiresIn: 60 * 60,
  },
  USER_PROJECTS_KEY: {
    name: "user_projects",
    params: ["fbID"],
    expiresIn: 60 * 60,
  },
};
