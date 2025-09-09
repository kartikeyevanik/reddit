// models/Session.ts
import mongoose from 'mongoose';

export interface ISession {
    _id: string;
    sessionToken: string;
    userId: string;
    expires: Date;
}

export interface ISessionDocument extends ISession, mongoose.Document {
    _id: string;
}

const sessionSchema = new mongoose.Schema({
    sessionToken: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    expires: {
        type: Date,
        required: true,
    },
});

sessionSchema.index({ userId: 1 });

export const Session = mongoose.models.Session || mongoose.model<ISessionDocument>('Session', sessionSchema);