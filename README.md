# login-monitoring

A deliberately tiny login app: a React page, an Express API and MongoDB. It is the
workload for cloud demos (VM, Docker, Kubernetes, hybrid), so the server keeps no
state of its own and takes all its settings from environment variables.

```
client/   React + Vite, axios for API calls: a single login page
server/   Express API with Mongoose models; also serves the built page from client/dist
```

## Requirements

- Node.js 22.9 or newer
- A MongoDB server. If you don't have one and Docker is running:

  ```
  docker run -d --name login-mongo -p 27017:27017 mongo:8
  ```

## Configuration

The server reads these environment variables. For local runs, put them in
`server/.env` (copy `server/.env.example`).

| Variable    | Required | Example                                      |
|-------------|----------|----------------------------------------------|
| `MONGO_URI` | yes      | `mongodb://127.0.0.1:27017/login-monitoring` |
| `PORT`      | no       | `3000` (the default)                         |

Put the database name in the URI path, as in the example; without one, MongoDB uses `test`.

## Install and create a user

```
cd server
npm install
cp .env.example .env               # then set MONGO_URI
npm run seed <username> <password>
```

```
cd client
npm install
```

There is no sign-up page: `npm run seed` creates a user, or resets the password of an existing one.

## Run

**Development**: two terminals, both reload on save.

```
cd server
npm run dev        # API on http://localhost:3000
```

```
cd client
npm run dev        # page on http://localhost:5173, forwards /api to :3000
```

**Production-style**: one process serves the page and the API.

```
cd client
npm run build
cd ../server
npm start          # http://localhost:3000
```

## API

| Request            | What it does |
|--------------------|--------------|
| `POST /api/login`  | Body `{ "username": "...", "password": "..." }`. Returns `{ "username": "..." }` when the credentials match, 401 when they don't. |
| `GET /api/health`  | 200 when MongoDB answers a ping, 503 when it doesn't. |

## Behaviour worth knowing for the demos

- **No sessions or cookies.** A login only checks the credentials against MongoDB, and
  refreshing the page shows the login form again. The server keeps no state, so several
  copies can run behind a load balancer.
- **The server starts even when MongoDB is down.** It retries every 5 seconds and logs each
  attempt; until it connects, `/api/health` and the login API return 503. That makes
  `/api/health` usable as a readiness check.
- Passwords are stored as bcrypt hashes, never in plain text.
