const User = require("../../models/user/user.model");
const Project = require("../../models/project/project.model");

module.exports = {
  createProject: async (req, res, next) => {
    const {fbID} = req.params;
    const {name, desc, } = req.body;
    
  },
};
