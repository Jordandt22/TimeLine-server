const userRouter = require("express-promise-router")();
const {
  createUser,
  getUser,
  deleteUser,
  getUserProjects,
} = require("../../controllers/user/user.ct");
const {
  bodyValidator,
  UserSchema,
} = require("../../validation/body.validator");
const {
  paramsValidator,
  FbIDSchema,
} = require("../../validation/params.validator");
const { authUser } = require("../../middlewares/auth/auth.mw");

// User API

// POST - Create User
userRouter.post(
  "/:fbID",
  paramsValidator(FbIDSchema),
  authUser(true),
  bodyValidator(UserSchema),
  createUser
);

// GET - Get a User
userRouter.get("/:fbID", paramsValidator(FbIDSchema), authUser(false), getUser);

// GET  - Get a User's Projects
userRouter.get(
  "/:fbID/projects",
  paramsValidator(FbIDSchema),
  authUser(false),
  getUserProjects
);

// DELETE - Remove User
userRouter.delete(
  "/:fbID",
  paramsValidator(FbIDSchema),
  authUser(false),
  deleteUser
);

module.exports = userRouter;
