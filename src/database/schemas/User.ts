import { Document, Schema } from 'mongoose';
import mongoose from '../';
import bcrypt from 'bcrypt';

export interface User extends Document { 
    user: string;
    password: string; 
}

const UserSchema = new Schema({
    user: {
        type: String,
        trim: true,
        unique: false,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    }
}, { timestamps: true });



UserSchema.pre<User>('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
});

export default mongoose.model<User>('User', UserSchema);