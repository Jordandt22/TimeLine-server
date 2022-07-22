const Joi = require("joi");

// User
const UserSchema = Joi.object()
  .keys({
    fbID: Joi.string().trim().min(1).max(2000).required().messages({
      "any.required": "Firebase ID is required !",
      "string.empty": "Firebase ID is required !",
      "string.min": "Firebase ID is required !",
      "string.max": "Your Firebase ID exceeds the character limit.",
    }),
    firstName: Joi.string().trim().min(1).max(150).required().messages({
      "any.required": "A first name is required.",
      "string.empty": "A first name is required.",
      "string.min": "A first name is required.",
      "string.max": "Your first name exceeds the character limit.",
    }),
    lastName: Joi.string().trim().min(1).max(150).required().messages({
      "any.required": "A last name is required.",
      "string.empty": "A last name is required.",
      "string.min": "A last name is required.",
      "string.max": "Your last name exceeds the character limit.",
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
      "string.max": "Your project name exceeds the character limit.",
    }),
    desc: Joi.string().trim().min(1).max(500).required().messages({
      "any.required": "A project description is required.",
      "string.empty": "A project description is required.",
      "string.min": "A project description is required.",
      "string.max": "Your project description exceeds the character limit.",
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
      "string.max": "Your project name exceeds the character limit.",
    }),
    desc: Joi.string().trim().min(1).max(500).required().messages({
      "any.required": "A project description is required.",
      "string.empty": "A project description is required.",
      "string.min": "A project description is required.",
      "string.max": "Your project description exceeds the character limit.",
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
  validator: (schema) => async (req, res, next) => {
    const result = schema.validate(req.body);
    const error = result.error;
    if (error) {
      let errors = {};
      error.details.map((e) => (errors[e.context.label] = e.message));
      return res.status(422).json({ errors });
    }

    next();
  },
  UserSchema,
  ProjectSchema,
  UpdateProjectSchema,
};
