export type IUser = {
  _id: string;
  username: string;
  email: string;
  photoURL: string;
  about: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
};

export type IChat = {
  _id: string;
  chatName?: string;
  chatImage?: string;
  type: "private" | "group";
  users: string[];
  lastMessage?: IMessage;
  createdAt: string;
  updatedAt: string;
};

export type IMessage = {
  _id: string;
  text: string;
  sender: {
    _id: string;
    username: string;
  };
  chat: string;
  delivered: boolean;
  read: boolean;
  readBy: Array<{
    user: string;
    readAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
};