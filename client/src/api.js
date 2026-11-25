import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const login = (username, password) =>
  api.post('/login', { username, password }).then((res) => res.data);
