// models/Account.ts
import mongoose from 'mongoose';

export interface IAccount {
    _id: string;
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token?: string;
    access_token?: string;
    expires_at?: number;
    token_type?: string;
    scope?: string;
    id_token?: string;
    session_state?: string;
}

export interface IAccountDocument extends IAccount, mongoose.Document {
    _id: string;
}

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    provider: {
        type: String,
        required: true,
    },
    providerAccountId: {
        type: String,
        required: true,
    },
    refresh_token: {
        type: String,
    },
    access_token: {
        type: String,
    },
    expires_at: {
        type: Number,
    },
    token_type: {
        type: String,
    },
    scope: {
        type: String,
    },
    id_token: {
        type: String,
    },
    session_state: {
        type: String,
    },
});

accountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });
accountSchema.index({ userId: 1 });

export const Account = mongoose.models.Account || mongoose.model<IAccountDocument>('Account', accountSchema);