# Chat & Video App

A full-stack real-time chat and video application built with NestJS (backend) and React + Vite (frontend). Features include authentication, chatroom, WebRTC video calls, and user management.

## Features

- Real-time chat using Socket.IO
- WebRTC video calls
- Authentication (JWT)
- User management
- Modern UI with React and Vite
- Backend API with NestJS and MongoDB

## Project Structure

```
chat-app-frontend/           # Frontend (React + Vite)
chat-app-backend/    # Backend (NestJS + MongoDB)
```

## Getting Started

### Frontend

```bash
cd chat-app-frontend
npm install
npm run dev
```

### Backend

```bash
cd chat-app-backend
npm install
npm start
```

## WebRTC Usage

- Start or answer a call to access camera/microphone.
- End call to release media devices.

## Environment Variables

- Configure backend `.env` for MongoDB URI, JWT secret, etc.

## License

MIT
