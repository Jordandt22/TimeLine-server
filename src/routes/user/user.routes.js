const userRouter = require("express-promise-router")();
const {
  createUser,
  getUser,
  deleteUser,
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

// GET - Get User
userRouter.get("/:fbID", paramsValidator(FbIDSchema), authUser(false), getUser);

// DELETE - Remove User
userRouter.delete(
  "/:fbID",
  paramsValidator(FbIDSchema),
  authUser(false),
  deleteUser
);

module.exports = userRouter;
