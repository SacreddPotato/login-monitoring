import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import express from 'express';
import mongoose from 'mongoose';
import { connectWithRetry, isConnected } from './db.js';
import { User } from './models/User.js';

const PORT = process.env.PORT || 3000;
const CLIENT_DIST = fileURLToPath(new URL('../../client/dist', import.meta.url));

connectWithRetry();

const app = express();
app.use(express.json());

function requireDb(req, res, next) {
  if (!isConnected()) return res.status(503).json({ error: 'Database is not connected, try again shortly' });
  next();
}

app.get('/api/health', async (req, res) => {
  try {
    if (!isConnected()) throw new Error('not connected');
    await mongoose.connection.db.command({ ping: 1 });
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

app.post('/api/login', requireDb, async (req, res) => {
  const { username, password } = req.body ?? {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    console.log(`Failed login for ${JSON.stringify(username)}`);
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  console.log(`Successful login for ${JSON.stringify(username)}`);
  res.json({ username: user.username });
});

app.use(express.static(CLIENT_DIST));
app.use((err, req, res, next) => {
  const status = err.status ?? 500;
  if (status >= 500) console.error(err);
  
  res.status(status).json({ error: err.expose ? err.message : 'Internal server error' });
});


app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server listening on http://localhost:${PORT}`);
});
