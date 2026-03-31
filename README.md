# Nestly — Buyer Portal

A full-stack real-estate buyer portal with JWT authentication and a favourites system.

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| Backend  | Node.js, Express 5, TypeScript, Mongoose |
| Database | MongoDB 7 |
| Auth     | JWT (jsonwebtoken) + bcrypt |
| Infra    | Docker, Docker Compose |

---

## Project Structure

```
techkraft-task2/
├── docker-compose.yml              # Orchestrates mongo + backend + frontend
├── .env.example                    # Root env vars for docker-compose
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── userController.ts       # register, login, CRUD
│   │   │   └── favouriteController.ts  # add, remove, list favourites
│   │   ├── middleware/
│   │   │   └── verifyUserToken.ts      # JWT auth guard
│   │   ├── models/
│   │   │   ├── userModel.ts            # User schema (email, name, hashed password, role)
│   │   │   └── favouriteModel.ts       # Favourite schema (userId → propertyId)
│   │   ├── routes/
│   │   │   ├── userRoutes.ts
│   │   │   └── favouriteRoutes.ts
│   │   ├── types/
│   │   │   └── express.d.ts            # Augments Express Request with req.user
│   │   └── server.ts                   # App entry point
│   ├── Dockerfile
│   ├── tsconfig.json
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── page.tsx                # Landing page (redirects if logged in)
    │   ├── login/page.tsx          # Login form
    │   ├── register/page.tsx       # Registration form
    │   └── dashboard/page.tsx      # Buyer dashboard + favourites
    ├── components/
    │   ├── PropertyCard.tsx        # Property card with heart toggle
    │   └── ui/Toast.tsx            # Toast notifications
    ├── lib/
    │   ├── api.ts                  # Typed API client (auto-injects JWT)
    │   ├── auth-context.tsx        # Global auth state (React Context + localStorage)
    │   └── properties.ts           # Mock property listings
    ├── Dockerfile
    └── package.json
```

---

## Prerequisites

- **Docker + Docker Compose** (recommended — runs everything in one command)
- **Or** Node.js ≥ 18 and a running MongoDB instance (for local dev without Docker)

---

## Running from Pre-built Images (no source code needed) (recommended)
 
Anyone can spin up the app with just two files — no cloning required.
 
### 1. Download the pull compose file
 
```bash
curl -O https://raw.githubusercontent.com/sumail829/techkraft-task2/main/docker-compose.pull.yml
```
 
Or create a `docker-compose.yml` with these contents:
  
```yaml
services:

  mongo:
    image: mongo:7
    container_name: nestly-mongo
    restart: unless-stopped
    environment:
      MONGO_INITDB_DATABASE: nestly
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"          
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: nestly-backend
    image: sumail829/nestly-backend
    restart: unless-stopped
    depends_on:
      mongo:
        condition: service_healthy
    environment:
      PORT: 7000
      MONGODB_URL: mongodb://mongo:27017/nestly
      JWT_USERTOKEN: ${JWT_USERTOKEN:-change_thisadsdasdas asd}
      FRONTEND_URL: ${FRONTEND_URL:-http://localhost:3002}
    ports:
      - "7000:7000"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL:-http://localhost:7000/api}
    container_name: nestly-frontend
    image: sumail829/nestly-frontend
    restart: unless-stopped
    depends_on:
      - backend
    environment:
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL:-http://localhost:7000/api}
    ports:
      - "3002:3002"

volumes:
  mongo_data:
    driver: local
```

### 2. Create a `.env` file
 
```bash
cat > .env << 'ENV'
JWT_USERTOKEN=replace_with_a_long_random_secretss
FRONTEND_URL=http://localhost:3002
NEXT_PUBLIC_API_URL=http://localhost:7000/api
ENV
```


### 3. Pull and start
 
```bash
docker compose pull          # downloads the latest images from Docker Hub
docker compose up -d         # starts everything in the background
```
 
Open **http://localhost:3002** — done.

## Running with Docker with code

### 1. Clone the repo

```bash
git clone https://github.com/sumail829/techkraft-task2.git
cd techkraft-task2
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and set a strong `JWT_USERTOKEN` secret:

```env
JWT_USERTOKEN=some_long_random_secret_here
FRONTEND_URL=http://localhost:3002
NEXT_PUBLIC_API_URL=http://localhost:7000/api
```

### 3. Build and start all services

```bash
docker compose up --build
```

This starts three containers:
- **mongo** — MongoDB on port `27017`
- **backend** — Express API on port `7000` (waits for Mongo to be healthy)
- **frontend** — Next.js on port `3002` (waits for backend to be healthy)

### 4. Open the app

```
http://localhost:3002
```

### Useful Docker commands

```bash
# Run in background
docker compose up --build -d

# View logs
docker compose logs -f

# View logs for one service
docker compose logs -f backend

# Stop all containers
docker compose down

# Stop and remove volumes (wipes the database)
docker compose down -v

# Rebuild a single service after code changes
docker compose up --build backend
```

---

## Running Locally (without Docker)

### Backend

```bash
cd backend

npm install

# Create env file
cp .env.example .env   # or create manually:
# PORT=7000
# MONGODB_URL=mongodb://localhost:27017/nestly  OR make a db on mongodb atlas and use that URL provided
# JWT_USERTOKEN=your_secret_here
# FRONTEND_URL=http://localhost:3002

# Development (ts-node-dev with hot reload)
npm run dev

# Production build + run
npm run build
npm start
```

### Frontend

```bash
cd frontend

npm install

# Create env file
echo "NEXT_PUBLIC_API_URL=http://localhost:7000/api" > .env.local

# Development
npm run dev

# Production build + run
npm run build
npm start
```

Frontend: **http://localhost:3002** · Backend: **http://localhost:7000**

---

## Example Flows

### Sign up → Login → Add Favourite (UI)

```
1. Open http://localhost:3002
2. Click "Get started" → fill in name, email, password → submit
3. Redirected to Login — sign in with the same credentials
4. On the Dashboard, browse the property grid
5. Click 🤍 on any card to add it to your favourites
6. Switch to "My Favourites" tab to see saved properties
7. Click ❤️ again to remove a favourite
```

### Sign up → Login → Add Favourite (curl)

```bash
# 1. Register
curl -X POST http://localhost:7000/api/user/create \
  -H "Content-Type: application/json" \
  -d '{"name":"Alex Sharma","email":"alex@example.com","password":"secret123"}'

# 2. Login — copy the token from the response
curl -X POST http://localhost:7000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@example.com","password":"secret123"}'

# 3. Add a favourite (replace TOKEN)
curl -X POST http://localhost:7000/api/favourite/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"propertyId":"prop_001"}'

# 4. List your favourites
curl http://localhost:7000/api/favourite/my \
  -H "Authorization: Bearer TOKEN"

# 5. Remove a favourite
curl -X DELETE http://localhost:7000/api/favourite/prop_001 \
  -H "Authorization: Bearer TOKEN"
```

---

## API Reference

### Auth (public)

| Method | Endpoint           | Body                              | Description         |
|--------|--------------------|-----------------------------------|---------------------|
| POST   | /api/user/create   | `{ name, email, password }`       | Register a new user |
| POST   | /api/user/login    | `{ email, password }`             | Login, returns JWT  |

### Users (protected)

| Method | Endpoint         | Description            |
|--------|------------------|------------------------|
| GET    | /api/user/       | List all users         |
| GET    | /api/user/:id    | Get a single user      |
| PATCH  | /api/user/:id    | Update a user          |
| DELETE | /api/user/:id    | Delete a user          |

### Favourites (protected)

| Method | Endpoint                          | Body                  | Description        |
|--------|-----------------------------------|-----------------------|--------------------|
| GET    | /api/favourite/my                 | —                     | Get my favourites  |
| POST   | /api/favourite/add                | `{ propertyId }`      | Add a favourite    |
| DELETE | /api/favourite/:propertyId | —                            | Remove a favourite |

All protected routes require the header: `Authorization: Bearer <token>`

### Health

| Method | Endpoint     | Description                     |
|--------|--------------|---------------------------------|
| GET    | /api/health  | Returns `{ status: "ok" }` — used by Docker health checks |

---

## Docker Architecture

```
┌─────────────────────────────────────────────┐
│              docker-compose                 │
│                                             │
│  ┌──────────┐    ┌──────────┐  ┌─────────┐ │
│  │ frontend │───▶│ backend  │─▶│  mongo  │ │
│  │  :3002   │    │  :5000   │  │ :27017  │ │
│  └──────────┘    └──────────┘  └─────────┘ │
│                                      │      │
│                              mongo_data     │
│                              (named vol)    │
└─────────────────────────────────────────────┘
```

- **Frontend** is a multi-stage build: installs deps → `next build` → runs with `npm start`
- **Backend** is a multi-stage build: installs deps → `tsc` compiles to `dist/` → runs compiled `dist/server.js` (no TypeScript in the final image)
- **MongoDB** data is persisted in a named Docker volume (`mongo_data`) — survives container restarts
- Services start in dependency order with health checks: Mongo must be healthy before backend starts, backend must be healthy before frontend starts

---

## Security Notes

- Passwords are hashed with **bcrypt** (salt rounds: 10) — never stored in plain text
- JWTs expire after **7 days**
- Login returns the same `"Invalid credentials"` message whether the email or password is wrong (prevents user enumeration)
- All user responses strip the `password` field
- Protected routes return `401 Unauthorized` for missing or invalid tokens