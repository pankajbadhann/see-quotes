require("dotenv").config();

const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const csrf = require("csurf");
const csrfProtection = csrf();
const connectDB = require("./config/db");
const env = require("./config/env");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

const { attachUser } = require("./middleware/attachUser");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// global limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);
app.use(helmet());

// db connection
connectDB();

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// static files
app.use(express.static(path.join(__dirname, "../public")));

// method override
app.use(methodOverride("_method"));

// session
app.use(session({
  secret: env.SESSION_SECRET || "dev_secret_change_me",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24,
  },
}));

// CSRF AFTER session ONLY
app.use(csrfProtection);

// attach user AFTER csrf safely
app.use((req, res, next) => {
  try {
    res.locals.csrfToken = req.csrfToken();
  } catch (e) {
    res.locals.csrfToken = null;
  }
  next();
});

app.use(attachUser);

// routes
app.use("/", authRoutes);
app.use("/posts", postRoutes);

// health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

// home route
app.get("/", (req, res) => {
  res.render("home");
});

// 404 handler
app.use((req, res, next) => {
  const error = new Error("Page not found");
  error.statusCode = 404;
  next(error);
});

// global error handler
app.use(errorHandler);

// server start
const PORT = env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// process handlers
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err.message);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err.message);
  process.exit(1);
});