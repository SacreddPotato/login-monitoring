import mongoose from 'mongoose';
import { setTimeout as delay } from 'node:timers/promises';

export const MONGO_URI = process.env.MONGO_URI;

const RETRY_DELAY_MS = 5000;

export const isConnected = () => mongoose.connection.readyState === mongoose.ConnectionStates.connected;

export async function connectWithRetry() {
  for (;;) {
    try {
      await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
      console.log(`Connected to MongoDB (database "${mongoose.connection.name}")`);
      return;
    } catch (err) {
      console.error(`MongoDB connection failed: ${err.message}. Retrying in ${RETRY_DELAY_MS / 1000}s...`);
      await delay(RETRY_DELAY_MS);
    }
  }
}
