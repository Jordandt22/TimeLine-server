const Joi = require("joi");
const { createError } = require("../utils/global.utils");

// User
const UserSchema = Joi.object()
  .keys({
    firstName: Joi.string().trim().min(1).max(150).required().messages({
      "any.required": "First Name is required.",
      "string.empty": "First Name is required.",
      "string.min": "First Name is required.",
      "string.max": "Your first name exceeds the character limit (150).",
    }),
    lastName: Joi.string().trim().min(1).max(150).required().messages({
      "any.required": "Last Name is required.",
      "string.empty": "Last Name is required.",
      "string.min": "Last Name is required.",
      "string.max": "Your last name exceeds the character limit (150).",
    }),
  })
  .options({ abortEarly: false });

// Project
const ProjectSchema = Joi.object()
  .keys({
    name: Joi.string().trim().min(1).max(150).required().messages({
      "any.required": "A project name is required !",
      "string.empty": "A project name is required !",
      "string.min": "A project name is required !",
      "string.max": "Your project name exceeds the character limit (150).",
    }),
    desc: Joi.string().trim().min(1).max(500).required().messages({
      "any.required": "A project description is required.",
      "string.empty": "A project description is required.",
      "string.min": "A project description is required.",
      "string.max":
        "Your project description exceeds the character limit (500).",
    }),
  })
  .options({ abortEarly: false });

// Update Project
const UpdateProjectSchema = Joi.object()
  .keys({
    name: Joi.string().trim().min(1).max(150).required().messages({
      "any.required": "A project name is required !",
      "string.empty": "A project name is required !",
      "string.min": "A project name is required !",
      "string.max": "Your project name exceeds the character limit (150).",
    }),
    desc: Joi.string().trim().min(1).max(500).required().messages({
      "any.required": "A project description is required.",
      "string.empty": "A project description is required.",
      "string.min": "A project description is required.",
      "string.max":
        "Your project description exceeds the character limit (500).",
    }),
    status: Joi.object()
      .keys({
        isOnHold: Joi.boolean().required(),
        isDeveloping: Joi.boolean().required(),
        isFinished: Joi.boolean().required(),
      })
      .required(),
  })
  .options({ abortEarly: false });

// Task
const TaskSchema = Joi.object()
  .keys({
    name: Joi.string().trim().min(1).max(150).required().messages({
      "any.required": "A task name is required !",
      "string.empty": "A task name is required !",
      "string.min": "A task name is required !",
      "string.max": "Your task name exceeds the character limit (150).",
    }),
    desc: Joi.string().trim().min(1).max(300).required().messages({
      "any.required": "A task description is required.",
      "string.empty": "A task description is required.",
      "string.min": "A task description is required.",
      "string.max": "Your task description exceeds the character limit (300).",
    }),
  })
  .options({ abortEarly: false });

// Update Task
const UpdateTaskSchema = Joi.object()
  .keys({
    name: Joi.string().trim().min(1).max(150).required().messages({
      "any.required": "A task name is required !",
      "string.empty": "A task name is required !",
      "string.min": "A task name is required !",
      "string.max": "Your task name exceeds the character limit (150).",
    }),
    desc: Joi.string().trim().min(1).max(300).required().messages({
      "any.required": "A task description is required.",
      "string.empty": "A task description is required.",
      "string.min": "A task description is required.",
      "string.max": "Your task description exceeds the character limit (300).",
    }),
    status: Joi.object()
      .keys({
        isOnHold: Joi.boolean().required(),
        isDeveloping: Joi.boolean().required(),
        isFinished: Joi.boolean().required(),
      })
      .required(),
  })
  .options({ abortEarly: false });

module.exports = {
  bodyValidator: (schema) => async (req, res, next) => {
    const result = schema.validate(req.body);
    const error = result.error;
    if (error) {
      let errors = {};
      error.details.map((e) => (errors[e.context.label] = e.message));
      return res.status(422).json(createError(422, errors, true));
    }

    next();
  },
  UserSchema,
  ProjectSchema,
  UpdateProjectSchema,
  TaskSchema,
  UpdateTaskSchema,
};
