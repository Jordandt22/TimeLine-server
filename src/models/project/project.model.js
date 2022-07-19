const mongoose = require("mongoose");
const { Schema } = mongoose;

// Status
const StatusSchema = new Schema({
  isOnHold: {
    type: Boolean,
    default: false,
  },
  isDeveloping: {
    type: Boolean,
    defualt: true,
  },
  isFinished: {
    type: Boolean,
    default: false,
  },
});

// Task
const TaskSchema = new Schema(
  {
    name: {
      type: String,
      min: 1,
      max: 150,
      required: true,
      default: "New Task",
    },
    desc: {
      type: String,
      min: 1,
      max: 300,
      required: true,
    },
    status: StatusSchema,
  },
  {
    timestamps: true,
  }
);

// Project
const ProjectSchema = new Schema(
  {
    creatorFbID: {
      type: String,
      required: true
    },
    name: {
      type: String,
      min: 1,
      max: 150,
      required: true,
      default: "New Project",
    },
    desc: {
      type: String,
      min: 1,
      max: 500,
      required: true,
    },
    tasks: [TaskSchema],
    status: StatusSchema,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", ProjectSchema);
