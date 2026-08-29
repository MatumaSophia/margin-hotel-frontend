import axios from 'axios';

// Base URL comes from .env.local (see project root) so it's easy to
// repoint for deployment without touching code.
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});