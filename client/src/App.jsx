import { useState } from 'react';
import { login } from './api.js';

export default function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin(event) {
    event.preventDefault();
    setError('');
    try {
      setUser(await login(username, password));
    } catch (err) {
      if (!err.response) setError('Could not reach the server');
      else setError(err.response.data?.error || `Login failed (HTTP ${err.response.status})`);
    } finally {
      setUsername('');
      setPassword('');
    }
  }

  if (user) {
    return (
      <main>
        <h1>Welcome, {user.username}</h1>
        <p>You are logged in.</p>
        <button onClick={() => setUser(null)}>Log out</button>
      </main>
    );
  }

  return (
    <main>
      <h1>Log in</h1>
      <form onSubmit={handleLogin}>
        <label>
          Username
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button type="submit">Log in</button>
      </form>
      {error && <p>{error}</p>}
    </main>
  );
}
