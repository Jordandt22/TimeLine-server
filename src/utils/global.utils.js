module.exports = {
  createError: (status, message, isValidationError) => ({
    error: {
      status,
      message,
      isValidationError
    },
  }),
};
