import mongoose, { Document, Schema } from "mongoose";

export interface IAuditLog {
    action: string;
    target?: string; // e.g. Content ID, User ID
    actor: string; // user who performed the action
    actorEmail?: string;
    details?: string;
    createdAt: Date;
}

export interface IAuditLogDocument extends IAuditLog, Document { }

const auditLogSchema = new Schema<IAuditLogDocument>(
    {
        action: { type: String, required: true },
        target: { type: String },
        actor: { type: String, required: true },
        actorEmail: { type: String },
        details: { type: String },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditLog =
    mongoose.models.AuditLog ||
    mongoose.model<IAuditLogDocument>("AuditLog", auditLogSchema);
