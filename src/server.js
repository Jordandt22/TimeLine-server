require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const rateLimiter = require("express-rate-limit");
const slowDown = require("express-slow-down");
const connect = require("./models/db");
const { authUser } = require("./middlewares/auth/auth.mw");
const { checkProject } = require("./middlewares/projects/projects.mw");
const {
  paramsValidator,
  FbIDSchema,
  FbIDAndProjectIDSchema,
} = require("./validation/params.validator");
const { getCacheData } = require("./redis/redis.mw");
const { PROJECT_KEY } = require("./redis/redis.keys");
const app = express();

// Middleware
const { NODE_ENV, WEB_URL } = process.env;
const notProduction = NODE_ENV !== "production";
app.use(helmet());
app.use(
  cors({
    origin: notProduction ? "http://localhost:3000" : WEB_URL,
  })
);
app.use(express.json());
if (notProduction) {
  app.use(morgan("dev"));
} else {
  app.enable("trust proxy");
  app.set("trust proxy", 1);
}

// Mongoose Connection
connect();

const timeLimit = 1000 * 60;
const maxReq = 100;
const limiter = rateLimiter({
  windowMs: timeLimit,
  max: maxReq * 2,
});
const speedLimiter = slowDown({
  windowMs: timeLimit,
  delayAfter: maxReq,
  delayMs: 300,
});

// Rate & Speed Limiters
app.use(speedLimiter);
app.use(limiter);

// Routes
const API_VERSION = `v${process.env.API_VERSION}`;

// Landing Page Route
app.get("/", (req, res) => {
  res.send("API Server for TimeLine is Up and Running !");
});

// API Routes
app.use(`/${API_VERSION}/api/user`, require("./routes/user/user.routes"));
app.use(
  `/${API_VERSION}/api/user/:fbID/projects`,
  paramsValidator(FbIDSchema),
  authUser(false),
  require("./routes/projects/projects.routes")
);
app.use(
  `/${API_VERSION}/api/user/:fbID/project/:projectID/tasks`,
  paramsValidator(FbIDAndProjectIDSchema),
  authUser(false),
  getCacheData(PROJECT_KEY),
  checkProject,
  require("./routes/projects/tasks.routes")
);

// PORT and Sever
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`CORS Enabled Server, Listening to port: ${PORT}...`);
});
