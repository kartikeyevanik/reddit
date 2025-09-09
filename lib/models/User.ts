// models/User.ts
import mongoose from 'mongoose';

export interface IUser {
    _id: string;
    email: string;
    password?: string;
    name?: string;
    role: 'SUBMITTER' | 'REVIEWER' | 'MODERATOR' | 'ADMIN';
    image?: string;
    emailVerified?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserDocument extends IUser, mongoose.Document {
    _id: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    name: {
        type: String,
    },
    role: {
        type: String,
        enum: ['SUBMITTER', 'REVIEWER', 'MODERATOR', 'ADMIN'],
        default: 'SUBMITTER',
    },
    image: {
        type: String,
    },
    emailVerified: {
        type: Date,
    },
}, {
    timestamps: true,
});

export const User = mongoose.models.User || mongoose.model<IUserDocument>('User', userSchema);