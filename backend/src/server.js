import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

import apiRouter from "./routes/api.js";
import { registerChat } from "./socket/chat.js";
import { pool } from "./db/pool.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

const allowedOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "Space Orbiters API",
    status: "running",
    endpoints: ["/api/health", "/api/planets", "/api/users", "/api/messages", "/api/launches"]
  });
});

app.use("/api", apiRouter);

const chatClientPath = path.resolve(__dirname, "../../frontend/chatroom");
app.use("/chat", express.static(chatClientPath));

const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"]
  }
});

registerChat(io);

const PORT = Number(process.env.PORT || 3000);

async function start() {
  try {
    await pool.query("SELECT 1");
    console.log("PostgreSQL connection established.");

    server.listen(PORT, () => {
      console.log(`Space Orbiters backend running on http://localhost:${PORT}`);
      console.log(`Chat client available at http://localhost:${PORT}/chat/`);
    });
  } catch (error) {
    console.error("Unable to connect to PostgreSQL:", error.message);
    process.exit(1);
  }
}

start();
