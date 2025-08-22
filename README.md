# Real-time Chat App

A real-time 1:1 chat application built with React Native (Expo) and Node.js (Express + Socket.IO), featuring JWT authentication, real-time messaging, typing indicators, and read receipts.

<<<<<<< HEAD
## Installation
=======
## Features

- **Authentication**: JWT-based register/login system
- **Real-time Messaging**: Instant message delivery using Socket.IO
- **User Management**: View all users and start conversations
- **Typing Indicators**: See when someone is typing
- **Online/Offline Status**: Track user presence
- **Message Receipts**: Delivery and read confirmations
- **Persistent Storage**: Messages stored in MongoDB

## Tech Stack
>>>>>>> 50d9c21 (80% done)

- **Frontend**: React Native with Expo
- **Backend**: Node.js, Express.js, Socket.IO
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens

## Quick Start (Local Setup)

### Prerequisites

- Node.js (v14 or higher)
- MongoDB running locally or MongoDB Atlas connection
- Expo CLI (`npm install -g @expo/cli`)

### 1. Start Backend Server

```bash
cd backend
npm install
npm start
```

The backend will run on `http://localhost:5000`

### 2. Start Mobile App

```bash
cd app-mobile
npm install
npm start
```

**Note**: Environment files (`.env`) are already configured for local development. If testing on a physical device, update the IP address in `app-mobile/.env`.

### 3. Test the App

- Register new users through the mobile app
- Start chatting with real-time messaging
- Test typing indicators and read receipts

## Sample Users

For testing purposes, you can create these sample users via the registration endpoint:

**User 1:**
- Username: `john_doe`
- Email: `john@example.com`
- Password: `password123`

**User 2:**
- Username: `jane_smith`
- Email: `jane@example.com`
- Password: `password123`

**User 3:**
- Username: `bob_wilson`
- Email: `bob@example.com`
- Password: `password123`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/profile` - Get logged-in user profile

### Users
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get specific user

### Conversations
- `GET /api/v1/conversations/:id/messages` - Get conversation messages

### Chats
- `GET /api/v1/chats` - Get user's chats
- `POST /api/v1/chats/private` - Create private chat
- `POST /api/v1/chats/group` - Create group chat

<<<<<<< HEAD
Visit README.md in the backend folder.
=======
### Messages
- `POST /api/v1/messages` - Send message
- `GET /api/v1/messages/chat/:chatId` - Get chat messages

## Socket Events

### Client → Server
- `addUser` - Join with user ID
- `message:send` - Send new message
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator
- `message:read` - Mark message as read
- `joinChat` - Join chat room
- `leaveChat` - Leave chat room

### Server → Client
- `message:new` - Receive new message
- `message:delivered` - Message delivery confirmation
- `message:read` - Message read receipt
- `typing:start` - User started typing
- `typing:stop` - User stopped typing
- `userOnline` - User came online
- `userOffline` - User went offline
- `getUsers` - Updated online users list

## Project Structure

```
chat-app/
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   └── config/         # Database config
│   ├── server.js           # Server entry point
│   └── package.json
└── app-mobile/             # React Native app
    ├── app/                # App screens
    ├── components/         # Reusable components
    ├── constants/          # App constants
    └── package.json
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
>>>>>>> 50d9c21 (80% done)
