const Joi = require("joi");
const { createError } = require("../utils/global.utils");

// Firebase ID
const FbIDSchema = Joi.object()
  .keys({
    fbID: Joi.string().trim().min(1).max(2000).required(),
  })
  .options({ abortEarly: false });

// Project ID
const ProjectIDSchema = Joi.object()
  .keys({
    projectID: Joi.string().trim().min(1).max(2000).required(),
  })
  .options({ abortEarly: false });

// Firebase ID and Project ID
const FbIDAndProjectIDSchema = Joi.object()
  .keys({
    fbID: Joi.string().trim().min(1).max(2000).required(),
    projectID: Joi.string().trim().min(1).max(2000).required(),
  })
  .options({ abortEarly: false });

// Task ID
const TaskIDSchema = Joi.object()
  .keys({
    taskID: Joi.string().trim().min(1).max(2000).required(),
  })
  .options({ abortEarly: false });

module.exports = {
  paramsValidator: (schema) => async (req, res, next) => {
    const result = schema.validate(req.params);
    const error = result.error;
    if (error) {
      let errors = {};
      error.details.map((e) => (errors[e.context.label] = e.message));
      return res.status(422).json(createError(422, errors, true));
    }

    next();
  },
  FbIDSchema,
  ProjectIDSchema,
  FbIDAndProjectIDSchema,
  TaskIDSchema,
};
