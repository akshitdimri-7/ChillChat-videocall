import express from "express";
import { createServer } from "node:http";

import { connectToSocket } from "./controllers/socketManager.js";
import mongoose from "mongoose";

import cors from "cors";

import userRoutes from "./routes/users.routes.js";

// Create an Express application (handles routes, middleware, APIs)
const app = express();

// Create a raw HTTP server and attach the Express app to it
// This is required so Socket.io can work properly
const server = createServer(app);

// Initialize Socket.io and attach it to the HTTP server
// This enables real-time communication (chat, notifications, etc.)
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8080);
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

const start = async () => {
  app.set("monogo_user");
  const connectionDb = await mongoose.connect(
    "mongodb+srv://allmimi0909_db_user:G10SSWsZUGs7Kf3r@cluster0.ymnyxxc.mongodb.net/?appName=Cluster0"
  );
  console.log(
    `MongoDB connected successfully on: ${connectionDb.connection.host}`
  );
  server.listen(app.get("port"), () => {
    console.log("Listening on port 8080.");
  });
};

start();
