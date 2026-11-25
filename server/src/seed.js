// Creates a user, or resets the password of an existing one.
// Usage: npm run seed <username> <password>
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { MONGO_URI } from './db.js';
import { User } from './models/User.js';

const [username, password] = process.argv.slice(2);
if (!username || !password) {
  console.error('Usage: npm run seed <username> <password>');
  process.exit(1);
}

try {
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  await User.init();
  const passwordHash = await bcrypt.hash(password, 10);
  await User.updateOne({ username }, { passwordHash }, { upsert: true });
  console.log(`User "${username}" saved.`);
} catch (err) {
  console.error(`Could not save user: ${err.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
