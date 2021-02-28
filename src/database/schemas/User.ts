import { Document, Schema } from 'mongoose';
import mongoose from '../';

export interface User extends Document { 
    state: string;
    token?: string;
    code?: string;
    refreshToken?: string;
    userFollowers?: number;
    userId?: string;
    userProfilePicture?: string;
    userName?: string;
    userEmail?: string;
}

const UserSchema = new Schema({
    state: {
        type: String,
        trim: true,
        unique: true,
        required: false
    },
    token: {
        type: String,
        required: false,
        select: false
    },
    code: {
        type: Number,
        required: false,
        select: false
    },
    refreshToken: {
        type: String,
        required: false,
        select: false
    },
    userFollowers: {
        type: Number,
        required: false,
        select: false
    },
    userId: {
        type: String,
        required: false,
        select: false
    },
    userProfilePicture: {
        type: String,
        required: false,
        select: false
    },
    userName: {
        type: String,
        required: false,
        select: false
    },
    userEmail: {
        type: String,
        required: false,
        select: false
    }
}, { timestamps: true });

export default mongoose.model<User>('User', UserSchema);