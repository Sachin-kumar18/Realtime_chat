# 💬 Realtime WebChat

A real-time chat app built with React, Node.js, Socket.IO, and MongoDB.

**Live Demo:** [Click here](https://realtime-chat-etfiqe0ix-sachins-projects-22e16704.vercel.app)

---

## Features

- JWT Authentication (Register / Login)

- Real-time messaging with Socket.IO

- Online/offline presence indicators

- Typing indicators

- Message status — Sent → Delivered → Read

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Socket.IO Client

- **Backend:** Node.js, Express, Socket.IO, MongoDB, Mongoose

---

## Local Setup

### 1. Clone the repo

```bash

git clone https://github.com/Sachin-kumar18/Realtime_chat.git

cd Realtime_chat

```

### Server

```bash

cd server

npm install

```

Create `server/.env`:

```

MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/dbname

JWT_SECRET=your_secret_here

CLIENT_URL=http://localhost:5173

```

```bash

npm run dev

```

### Client

```bash

cd client

npm install

```

Create `client/.env`:

```

VITE_API_URL=http://localhost:5000/api

VITE_SOCKET_URL=http://localhost:5000

```

```bash

npm run dev

```
---

## Deployment
 
- **Server** → [Render](https://render.com) (Root dir: `server`)
- **Client** → [Vercel](https://vercel.com) (Root dir: `client`)


---

## Author

Built by [Sachin Kumar](https://github.com/your-username)
