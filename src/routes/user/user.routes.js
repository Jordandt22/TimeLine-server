const userRouter = require("express-promise-router")();
const { createUser, getUser } = require("../../controllers/user/user.ct");
const {
  validator: bodyValidator,
  UserSchema,
} = require("../../validation/body.validator");
const {
  validator: paramsValidator,
  FbIDSchema,
} = require("../../validation/params.validator");
const { getCacheData } = require("../../redis/redis.mw");
const { USER_KEY } = require("../../redis/redis.keys");

// User API

// POST - Create User
userRouter.post("/", bodyValidator(UserSchema), createUser);

// GET - Get User
userRouter.get(
  "/:fbID",
  paramsValidator(FbIDSchema),
  getCacheData(USER_KEY),
  getUser
);

module.exports = userRouter;
