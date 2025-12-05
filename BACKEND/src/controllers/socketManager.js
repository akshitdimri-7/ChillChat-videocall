import { Server } from "socket.io";
// Importing the Socket.IO Server class so we can create a WebSocket server.

let connections = {};
// Object to store user connection info (currently unused).

let messages = {};
// Object to store chat messages (currently unused).

let timeOnline = {};
// Object to store how long each user stayed online (currently unused).

export const connectToSocket = (server) => {
  // Exporting a function that receives your main HTTP/Express server.

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });
  // Creating a new Socket.IO instance and attaching it to your server.

  io.on("connection", (socket) => {
    console.log("Something Connected");
    // Event listener for every new client that connects.
    // Each connected client gets a unique socket object with socket.id.

    socket.on("join-call", (path) => {
      // Listener for users joining a call.
      // 'path' usually represents a room or call ID.

      if (connections[path] === undefined) {
        connections[path] = [];
      }
      connections[path].push(socket.id);

      timeOnline[socket.id] = new Date();

      for (let a = 0; a < connections[path].length; a++) {
        io.to(connections[path][a]).emit(
          "user-joined",
          socket.id,
          connections[path]
        );
      }
      if (messages[path] !== undefined) {
        for (let a = 0; a < messages[path].length; a++) {
          io.to(socket.id).emit(
            "chat-message",
            messages[path][a]["data"],
            messages[path][a]["sender"],
            messages[path][a]["socket-id-sender"]
          );
        }
      }
    });

    socket.on("signal", (toId, message) => {
      // Listener for WebRTC signaling data (offer/answer/ICE candidates).
      io.to(toId).emit("signal", socket.id, message);
      // This tries to send signaling data to another user.
    });

    socket.on("chat-message", (data, sender) => {
      // Listener for chat messages sent by a user.
      // 'data' contains the message, 'sender' identifies who sent it.
      const [matchingRoom, found] = Object.entries(connections).reduce(
        ([room, isFound], [roomKey, roomValue]) => {
          if (!isFound && roomValue.includes(socket.id)) {
            return [roomKey, true];
          }
          return [roomKey, isFound];
        },
        ["", false]
      );
      if (found === true) {
        if (messages[matchingRoom] === undefined) {
          messages[matchingRoom] = [];
        }
        messages[matchingRoom].push({
          sender: sender,
          data: data,
          "socket-id-sender": socket.id,
        });
        console.log(`message in room ${matchingRoom}:`, sender, data);
        connections[matchingRoom].forEach((elem) => {
          io.to(elem).emit("chat-message", data, sender, socket.id);
        });
      }
    });

    socket.on("disconnect", () => {
      // Event triggered when a user disconnects (closes tab, internet off, etc.).
      var diffTime = Math.abs(timeOnline[socket.id] - new Date());
      var key;

      for (const [k, v] of JSON.parse(
        JSON.stringify(Object.entries(connections))
      )) {
        for (let a = 0; a < v.length; a++) {
          if (v[a] === socket.id) {
            key = k;
            for (let a = 0; a < connections[key].length; a++) {
              io.to(connections[key][a]).emit("user-left", socket.id);
            }
            var index = connections[key].indexOf(socket.id);
            connections[key].splice(index, 1);

            if (connections[key].length === 0) {
              delete connections[key];
            }
          }
        }
      }
    });
  });

  return io;
  // Return the Socket.IO instance so it can be used elsewhere.
};
