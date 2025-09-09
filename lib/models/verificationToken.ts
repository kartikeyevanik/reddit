// models/VerificationToken.ts
import mongoose from 'mongoose';

export interface IVerificationToken {
    _id: string;
    identifier: string;
    token: string;
    expires: Date;
}

export interface IVerificationTokenDocument extends IVerificationToken, mongoose.Document {
    _id: string;
}

const verificationTokenSchema = new mongoose.Schema({
    identifier: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
        unique: true,
    },
    expires: {
        type: Date,
        required: true,
    },
});

verificationTokenSchema.index({ identifier: 1, token: 1 }, { unique: true });

export const VerificationToken = mongoose.models.VerificationToken || mongoose.model<IVerificationTokenDocument>('VerificationToken', verificationTokenSchema);