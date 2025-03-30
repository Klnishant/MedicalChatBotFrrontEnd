import mongoose, {Schema,Document, ObjectId} from 'mongoose';

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    history: ObjectId[];
}

const UserSchema: Schema<User> = new Schema({
    username: {
         type: String,
          required: [true, 'Username is required']
        },
    email: {
         type: String, 
         required: [true, 'Email is required'], 
         unique: [true, 'Email already exists'] 
        },
    password: {
         type: String,
         required: [true, 'Password is required'] 
        },
    verifyCode: {
         type: String,
          required: [true, 'Verify code is required'] 
        },
    isVerified: {
         type: Boolean,
          default: false 
        },
    verifyCodeExpiry: {
         type: Date,
          default: Date.now 
        },
    history: [
            { 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'History'
            }
        ]
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', UserSchema);

export default UserModel;