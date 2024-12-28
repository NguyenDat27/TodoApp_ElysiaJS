import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  username: string;
  password: string;
  refreshToken?: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: String }
}, {
  timestamps: true,
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;