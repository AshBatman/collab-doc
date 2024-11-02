# Collaborative Document Editor Server

A Node.js server for a real-time collaborative document editor. This server uses MongoDB as the primary database to store user data and documents, and Redis for caching. Redis Insight is used to monitor Redis.


## Features

- **Real-Time Collaboration**: Powered by Socket.IO for real-time updates.
- **Database**: MongoDB for user and document storage.
- **Caching**: Redis for quick access to frequently accessed data.
- **Error Handling**: Consistent error messages and status codes.
- **Pre-commit Linting and Tests**: Ensures code quality with ESLint, Husky, and lint-staged.


## Prerequisites

- **Node.js** (v20.x or higher)
- **MongoDB Atlas** (Connected to personal ATLAS mongo account - you can change the uri in config.js file to run)
- **Redis** (local installation or cloud Redis service)
- **RedisInsight** (for Redis monitoring)


## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/collab-editor-server.git
cd collab-editor-server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create .env file in project root with following variables:
PORT=5000
REDIS_HOST=localhost
REDIS_PORT=6379
DB_PASSWORD=

### 4. Run server

```bash
npm run dev
OR
npm start
```

## Server will be accessible at
```bash
http://localhost:5000
```

## API Endpoints
Postman collection file: Rocketium.postman_collection.json
