const mongoose = require("mongoose");
const { Schema } = mongoose;

// Project ID 
const ProjectIDSchema = new Schema(
  {
    creatorID: {
      type: String,
      required: true,
    },
    projectID: {
      type: String,
      required: true,
    },
    lastViewed: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  }
);

// User 
const UserSchema = new Schema(
  {
    fbID: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      min: 1,
      max: 150,
      required: true,
    },
    lastName: {
      type: String,
      min: 1,
      max: 150,
      required: true,
    },
    email: {
      type: String,
      min: 1,
      max: 150,
      lowercase:true,
      required: true,
    },
    projects: [ProjectIDSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
