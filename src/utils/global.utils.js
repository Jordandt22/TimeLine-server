

module.exports = {
  createError: (status, message) => ({
    error: {
      status,
      message
    }
  })
}