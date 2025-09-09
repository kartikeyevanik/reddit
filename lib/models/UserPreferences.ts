// models/UserPreferences.ts
import mongoose from 'mongoose';

export interface IUserPreferences {
  _id: string;
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserPreferencesDocument extends IUserPreferences, mongoose.Document {
  _id: string;
}

const userPreferencesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  emailNotifications: {
    type: Boolean,
    default: true,
  },
  pushNotifications: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export const UserPreferences = mongoose.models.UserPreferences || mongoose.model<IUserPreferencesDocument>('UserPreferences', userPreferencesSchema);