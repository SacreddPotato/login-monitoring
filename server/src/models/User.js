import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
})

userSchema.set('toJSON', {
  transform: (doc, returnedObject) => {
    delete returnedObject.passwordHash;
    delete returnedObject.__v;
  },
})

export const User = mongoose.model('User', userSchema)
