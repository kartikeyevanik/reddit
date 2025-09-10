import { Schema, model, models, Document } from 'mongoose';

export interface INotification extends Document {
    userId: string;
    contentId: string;
    title: string;
    message: string;
    type: 'SUBMISSION' | 'APPROVAL' | 'REJECTION' | 'SYSTEM';
    status: 'PENDING' | 'RESOLVED' | 'ACTION_REQUIRED';
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
    {
        userId: { type: String, required: true },
        contentId: { type: String, required: true },
        title: { type: String, required: true },
        message: { type: String, required: true },
        type: { type: String, enum: ['SUBMISSION', 'APPROVAL', 'REJECTION', 'SYSTEM'], default: 'SUBMISSION' },
        status: { type: String, enum: ['PENDING', 'RESOLVED', 'ACTION_REQUIRED'], default: 'PENDING' },
        read: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Notification = models.Notification || model<INotification>('Notification', notificationSchema);
