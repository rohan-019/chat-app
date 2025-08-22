import { io } from "socket.io-client";
import React from "react";
import useAuth from "../hooks/useAuth";
import Constants from "expo-constants";

type IOnlineUser = {
  userId: string;
  socketId: string;
};

const wsUrl = Constants.expoConfig?.extra?.wsUrl || "http://localhost:5000";

export const socket = io(wsUrl, {
  transports: ['websocket', 'polling'],
  timeout: 20000,
});

export const socketContext = React.createContext({
  socket,
  onlineUsers: [] as IOnlineUser[],
});

export const useSocket = () => {
  return React.useContext(socketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = React.useState<IOnlineUser[]>([]);

  React.useEffect(() => {
    // Connection event listeners
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    if (user) {
      console.log("Adding user to socket:", user._id);
      socket.emit("addUser", user._id);
    }

    socket.on("getUsers", (users) => {
      console.log("Received online users:", users);
      setOnlineUsers(users);
    });

    // Cleanup listeners
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("getUsers");
    };
  }, [user]);

  const value = {
    socket,
    onlineUsers,
  };

  return (
    <socketContext.Provider value={value}>{children}</socketContext.Provider>
  );
};
