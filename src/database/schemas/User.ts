import { Document, Schema } from 'mongoose';
import mongoose from '../';

export interface User extends Document { 
    state: string;
    token?: string;
    code?: string;
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
    }
}, { timestamps: true });

export default mongoose.model<User>('User', UserSchema);