const { Server } = require("socket.io");
const User = require("../models/userModel");
const Message = require("../models/Message");

const onlineUsers = new Map();

function initSocket(server) {
  const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",").map((o) => o.trim())
    : ["http://localhost:5173"];

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("user:online", async (userId) => {
      try {
        socket.userId = userId;
        onlineUsers.set(userId, socket.id);

        await User.findByIdAndUpdate(userId, { isOnline: true });

        io.emit("user:status", { userId, isOnline: true });
        socket.emit("users:online", Array.from(onlineUsers.keys()));
      } catch (err) {
        socket.emit("error", { message: err.message });
      }
    });

    socket.on("message:send", async (data) => {
      try {
        const { receiverId, content } = data;
        const senderId = socket.userId;

        if (!senderId) {
          return socket.emit("error", { message: "Not authenticated" });
        }

        const message = await Message.create({ senderId, receiverId, content });
        const receiverSocketId = onlineUsers.get(receiverId?.toString());
        socket.emit("message:sent", message);

        if (receiverSocketId) {
          await Message.updateOne(
            { _id: message._id },
            { $set: { status: "delivered" } },
          );
          message.status = "delivered";

          io.to(receiverSocketId).emit("message:receive", message);
          socket.emit("message:delivered", { messageId: message._id });
        }
      } catch (err) {
        socket.emit("error", { message: err.message });
      }
    });

    socket.on("typing:start", ({ senderId, receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId?.toString());
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing:start", { senderId });
      }
    });

    socket.on("typing:stop", ({ senderId, receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId?.toString());
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing:stop", { senderId });
      }
    });

    socket.on("message:read", async ({ senderId, receiverId }) => {
      try {
        await Message.updateMany(
          { senderId, receiverId, status: { $ne: "read" } },
          { $set: { status: "read" } },
        );

        const senderSocketId = onlineUsers.get(senderId);
        if (senderSocketId) {
          io.to(senderSocketId).emit("message:read", { by: receiverId });
        }
      } catch (err) {
        socket.emit("error", { message: err.message });
      }
    });

    socket.on("disconnect", async () => {
      const userId = socket.userId;
      if (!userId) return;

      setTimeout(async () => {
        try {
          const currentSocketId = onlineUsers.get(userId);
          if (currentSocketId === socket.id) {
            onlineUsers.delete(userId);
            io.emit("user:status", { userId, isOnline: false });
            await User.findByIdAndUpdate(userId, { isOnline: false });
          }
        } catch (error) {
          console.error("Error handling disconnect for user:", userId, error);
        }
      }, 3000);
    });
  });

  return io;
}

module.exports = initSocket;
