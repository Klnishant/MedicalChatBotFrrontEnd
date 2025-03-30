import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface History extends Document {
    question: string;
    answer: string;
    user: ObjectId;
    createdAt: Date;
}

const HistorySchema: Schema<History> = new Schema({
    question: {
         type: String,
          required: true 
        },
    answer: {
         type: String,
          required: true 
        },
    user: {
         type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'User' 
        },
    createdAt: {
         type: Date,
         required: true,
         default:Date.now 
        },
});

const HistoryModel = (mongoose.models.History as mongoose.Model<History>) || mongoose.model<History>('History', HistorySchema);

export default HistoryModel;