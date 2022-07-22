const Joi = require("joi");

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

module.exports = {
  validator: (schema) => async (req, res, next) => {
    const result = schema.validate(req.params);
    const error = result.error;
    if (error) {
      let errors = {};
      error.details.map((e) => (errors[e.context.label] = e.message));
      return res.status(422).json({ errors });
    }

    next();
  },
  FbIDSchema,
  ProjectIDSchema
};
