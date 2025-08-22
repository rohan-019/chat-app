import app from "./src/app.js";
import chalk from "chalk";
import connectDB from "./src/config/connectDB.js";
import { Server } from "socket.io";

connectDB();

// Handling uncaught error
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(
    `\nStarted Server on port ${process.env.PORT}\n\n${chalk.blue(
      `http://localhost:${process.env.PORT}`
    )}\n`
  );
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:19000",
    credentials: true,
  },
});

global.users = [];
global.typingUsers = new Map(); // Track typing users per chat

const addUser = (userId, socketId) => {
  // Remove existing user if already connected
  users = users.filter((user) => user.userId !== userId);
  users.push({ userId, socketId, isOnline: true, lastSeen: new Date() });
};

const removeUser = (socketId) => {
  const user = users.find((user) => user.socketId === socketId);
  if (user) {
    user.isOnline = false;
    user.lastSeen = new Date();
  }
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const getUsersInChat = (chatId, excludeUserId = null) => {
  // This would need to be implemented with proper chat membership lookup
  // For now, return all online users except the sender
  return users.filter(user => user.isOnline && user.userId !== excludeUserId);
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins with their ID
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    socket.userId = userId;
    
    // Broadcast online users
    io.emit("getUsers", users.filter(u => u.isOnline));
    
    // Notify others that this user is online
    socket.broadcast.emit("userOnline", { userId, isOnline: true });
  });

  // Assignment requirement: message:send → send new msg
  socket.on("message:send", ({ text, chatId, senderId, senderDisplayName, receiverId }) => {
    const receiverUser = getUser(receiverId);

    // Emit to receiver if online
    if (receiverUser) {
      io.to(receiverUser.socketId).emit("message:new", {
        text,
        chat: chatId,
        sender: {
          _id: senderId,
          displayName: senderDisplayName,
        },
        delivered: true,
        read: false,
        createdAt: new Date(),
      });
    }

    // Also emit to sender for confirmation
    socket.emit("message:delivered", {
      chatId,
      delivered: !!receiverUser,
      timestamp: new Date(),
    });
  });

  // Assignment requirement: typing:start
  socket.on("typing:start", ({ chatId, userId, username }) => {
    if (!typingUsers.has(chatId)) {
      typingUsers.set(chatId, new Set());
    }
    typingUsers.get(chatId).add({ userId, username });
    
    // Broadcast to other users in the chat
    socket.to(chatId).emit("typing:start", { chatId, userId, username });
  });

  // Assignment requirement: typing:stop
  socket.on("typing:stop", ({ chatId, userId }) => {
    if (typingUsers.has(chatId)) {
      const chatTypers = typingUsers.get(chatId);
      chatTypers.forEach(typer => {
        if (typer.userId === userId) {
          chatTypers.delete(typer);
        }
      });
      
      if (chatTypers.size === 0) {
        typingUsers.delete(chatId);
      }
    }
    
    // Broadcast to other users in the chat
    socket.to(chatId).emit("typing:stop", { chatId, userId });
  });

  // Assignment requirement: message:read
  socket.on("message:read", ({ messageId, chatId, userId }) => {
    // Broadcast read receipt to other users in the chat
    socket.to(chatId).emit("message:read", {
      messageId,
      chatId,
      readBy: userId,
      readAt: new Date(),
    });
  });

  // Join chat room
  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.userId} joined chat ${chatId}`);
  });

  // Leave chat room
  socket.on("leaveChat", (chatId) => {
    socket.leave(chatId);
    console.log(`User ${socket.userId} left chat ${chatId}`);
  });

  // Get online status of specific user
  socket.on("getUserById", (userId, otherUserId) => {
    const user = getUser(userId);
    const otherUser = getUser(otherUserId);

    if (user) {
      io.to(user.socketId).emit("getOtherUser", {
        ...otherUser,
        isOnline: otherUser?.isOnline || false,
        lastSeen: otherUser?.lastSeen,
      });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    
    // Clear typing status for this user
    typingUsers.forEach((chatTypers, chatId) => {
      chatTypers.forEach(typer => {
        if (typer.userId === socket.userId) {
          chatTypers.delete(typer);
          socket.to(chatId).emit("typing:stop", { chatId, userId: socket.userId });
        }
      });
    });

    // Remove user and broadcast offline status
    const user = users.find(u => u.socketId === socket.id);
    if (user) {
      socket.broadcast.emit("userOffline", { 
        userId: user.userId, 
        isOnline: false, 
        lastSeen: new Date() 
      });
    }
    
    removeUser(socket.id);
    io.emit("getUsers", users.filter(u => u.isOnline));
  });
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// SIGTERM is a signal that is sent to a process to tell it to terminate.
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
