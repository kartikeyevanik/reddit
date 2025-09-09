// lib/mongoose-adapter.ts
import { Adapter } from 'next-auth/adapters';
import { Account, IAccount } from '@/lib/models/Accounts';
import { Session, ISession } from '@/lib/models/Session';
import { User, IUser } from '@/lib/models/User';
import { VerificationToken, IVerificationToken } from '@/lib/models/verificationToken';
import { UserPreferences } from '@/lib/models/UserPreferences';
import connectDB from './db';

export function MongooseAdapter(): Adapter {
    return {
        async createUser(user) {
            await connectDB();

            const newUser = await User.create({
                email: user.email,
                name: user.name,
                image: user.image,
                emailVerified: user.emailVerified,
                role: 'SUBMITTER',
            });

            // Create default preferences
            await UserPreferences.create({
                userId: newUser._id,
                emailNotifications: true,
                pushNotifications: true,
            });

            return {
                id: newUser._id.toString(),
                email: newUser.email,
                name: newUser.name,
                image: newUser.image,
                emailVerified: newUser.emailVerified,
                role: newUser.role,
            };
        },

        async getUser(id) {
            await connectDB();
            const user = await User.findById(id);
            if (!user) return null;

            return {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                image: user.image,
                emailVerified: user.emailVerified,
                role: user.role,
            };
        },

        async getUserByEmail(email) {
            await connectDB();
            const user = await User.findOne({ email });
            if (!user) return null;

            return {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                image: user.image,
                emailVerified: user.emailVerified,
                role: user.role,
            };
        },

        async getUserByAccount({ provider, providerAccountId }) {
            await connectDB();
            const account = await Account.findOne({ provider, providerAccountId })
                .populate<{ userId: IUser }>('userId');

            if (!account || !account.userId) return null;

            const user = account.userId;
            return {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                image: user.image,
                emailVerified: user.emailVerified,
                role: user.role,
            };
        },

        async updateUser(user) {
            await connectDB();
            const updatedUser = await User.findByIdAndUpdate(
                user.id,
                {
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    emailVerified: user.emailVerified,
                },
                { new: true }
            );

            if (!updatedUser) throw new Error('User not found');

            return {
                id: updatedUser._id.toString(),
                email: updatedUser.email,
                name: updatedUser.name,
                image: updatedUser.image,
                emailVerified: updatedUser.emailVerified,
                role: updatedUser.role,
            };
        },

        async deleteUser(userId) {
            await connectDB();
            await User.findByIdAndDelete(userId);
            await Account.deleteMany({ userId });
            await Session.deleteMany({ userId });
            await UserPreferences.deleteMany({ userId });
        },

        async linkAccount(account) {
            await connectDB();
            await Account.create({
                userId: account.userId,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
            });
        },

        async unlinkAccount({ provider, providerAccountId }) {
            await connectDB();
            await Account.deleteOne({ provider, providerAccountId });
        },

        async createSession(session) {
            await connectDB();
            const newSession = await Session.create({
                sessionToken: session.sessionToken,
                userId: session.userId,
                expires: session.expires,
            });

            return {
                sessionToken: newSession.sessionToken,
                userId: newSession.userId.toString(),
                expires: newSession.expires,
            };
        },

        async getSessionAndUser(sessionToken) {
            await connectDB();
            const session = await Session.findOne({ sessionToken })
                .populate<{ userId: IUser }>('userId');

            if (!session || !session.userId) return null;

            const user = session.userId;
            return {
                session: {
                    sessionToken: session.sessionToken,
                    userId: session.userId._id.toString(),
                    expires: session.expires,
                },
                user: {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    emailVerified: user.emailVerified,
                    role: user.role,
                },
            };
        },

        async updateSession(session) {
            await connectDB();
            const updatedSession = await Session.findOneAndUpdate(
                { sessionToken: session.sessionToken },
                {
                    expires: session.expires,
                    userId: session.userId,
                },
                { new: true }
            );

            if (!updatedSession) return null;

            return {
                sessionToken: updatedSession.sessionToken,
                userId: updatedSession.userId.toString(),
                expires: updatedSession.expires,
            };
        },

        async deleteSession(sessionToken) {
            await connectDB();
            await Session.deleteOne({ sessionToken });
        },

        async createVerificationToken(token) {
            await connectDB();
            await VerificationToken.create({
                identifier: token.identifier,
                token: token.token,
                expires: token.expires,
            });

            return token;
        },

        async useVerificationToken({ identifier, token }) {
            await connectDB();
            const verificationToken = await VerificationToken.findOneAndDelete({
                identifier,
                token,
            });

            if (!verificationToken) return null;

            return {
                identifier: verificationToken.identifier,
                token: verificationToken.token,
                expires: verificationToken.expires,
            };
        },
    };
}