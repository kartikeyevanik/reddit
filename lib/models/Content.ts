// lib/models/content.ts
import mongoose from 'mongoose';

export interface IContent {
    _id: string;
    title: string;
    description?: string;
    type: 'TEXT' | 'IMAGE' | 'URL' | 'VIDEO';
    textContent?: string;
    imageUrl?: string;
    videoUrl?: string;
    url?: string;
    tags: string[];
    status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ESCALATED' | 'ARCHIVED';
    priority: number;
    submitterId: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
}

export interface IContentDocument extends IContent, mongoose.Document {
    _id: string;
}

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    },
    description: {
        type: String,
        trim: true,
        maxlength: 1000,
    },
    type: {
        type: String,
        enum: ['TEXT', 'IMAGE', 'URL', 'VIDEO'],
        required: true,
    },
    textContent: {
        type: String,
        trim: true,
        maxlength: 10000,
    },
    imageUrl: {
        type: String,
        trim: true,
    },
    videoUrl: {
        type: String,
        trim: true,
    },
    url: {
        type: String,
        trim: true,
    },
    tags: [{
        type: String,
        trim: true,
    }],
    status: {
        type: String,
        enum: ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'ESCALATED', 'ARCHIVED'],
        default: 'PENDING',
    },
    priority: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
    },
    submitterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    publishedAt: {
        type: Date,
    },
}, {
    timestamps: true, // This adds createdAt and updatedAt automatically
});

// Make sure the model name is correct
export const Content = mongoose.models.Content || mongoose.model<IContentDocument>('Content', contentSchema);