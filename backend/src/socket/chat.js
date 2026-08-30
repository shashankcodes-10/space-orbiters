import { pool } from "../db/pool.js";

const rooms = new Map();

function getRoomUsers(room) {
  return [...(rooms.get(room) || new Map()).values()];
}

async function getOrCreateUser(username) {
  const cleanUsername = String(username || "").trim().slice(0, 100);

  if (!cleanUsername) {
    throw new Error("Username is required");
  }

  const result = await pool.query(
    `INSERT INTO users (username)
     VALUES ($1)
     ON CONFLICT (username)
     DO UPDATE SET username = EXCLUDED.username
     RETURNING id, username`,
    [cleanUsername]
  );

  return result.rows[0];
}

async function saveMessage(userId, message) {
  const result = await pool.query(
    `INSERT INTO messages (user_id, message)
     VALUES ($1, $2)
     RETURNING id, message, created_at`,
    [userId, message]
  );

  return result.rows[0];
}

export function registerChat(io) {
  io.on("connection", (socket) => {
    socket.on("joinRoom", async ({ username, room }) => {
      try {
        const user = await getOrCreateUser(username);
        const cleanRoom = String(room || "Stellar Explorers").trim();

        socket.data.user = user;
        socket.data.room = cleanRoom;
        socket.join(cleanRoom);

        if (!rooms.has(cleanRoom)) rooms.set(cleanRoom, new Map());
        rooms.get(cleanRoom).set(socket.id, {
          id: user.id,
          username: user.username
        });

        socket.emit("message", {
          username: "Orbiters Bot",
          text: "Welcome to OrbitersCord",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        });

        socket.broadcast.to(cleanRoom).emit("message", {
          username: "Orbiters Bot",
          text: `${user.username} has joined the chat`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        });

        io.to(cleanRoom).emit("roomUsers", {
          room: cleanRoom,
          users: getRoomUsers(cleanRoom)
        });

        const history = await pool.query(`
          SELECT m.id, m.message AS text, m.created_at, u.username
          FROM messages m
          LEFT JOIN users u ON u.id = m.user_id
          ORDER BY m.created_at DESC
          LIMIT 50
        `);

        socket.emit(
          "messageHistory",
          history.rows.reverse().map((row) => ({
            id: row.id,
            username: row.username || "Unknown",
            text: row.text,
            time: new Date(row.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })
          }))
        );
      } catch (error) {
        console.error("joinRoom error:", error);
        socket.emit("chatError", "Unable to join the chat room.");
      }
    });

    socket.on("chatMessage", async (message) => {
      try {
        const user = socket.data.user;
        const room = socket.data.room;
        const text = String(message || "").trim().slice(0, 2000);

        if (!user || !room || !text) return;

        const saved = await saveMessage(user.id, text);
        io.to(room).emit("message", {
          id: saved.id,
          username: user.username,
          text: saved.message,
          time: new Date(saved.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })
        });
      } catch (error) {
        console.error("chatMessage error:", error);
        socket.emit("chatError", "Unable to save the message.");
      }
    });

    socket.on("disconnect", () => {
      const room = socket.data.room;
      const user = socket.data.user;
      if (!room || !user || !rooms.has(room)) return;

      rooms.get(room).delete(socket.id);

      io.to(room).emit("message", {
        username: "Orbiters Bot",
        text: `${user.username} has left the chat`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      });

      io.to(room).emit("roomUsers", {
        room,
        users: getRoomUsers(room)
      });

      if (rooms.get(room).size === 0) rooms.delete(room);
    });
  });
}
