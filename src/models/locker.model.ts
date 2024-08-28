import { Document, model, Model, Schema } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import { LockerStatus } from "../types/locker";

export interface ILocker extends Document {
    id: string;
    bloqId: string;
    status: LockerStatus;
    isOccupied: Boolean;
    createdAt: Date;
    updatedAt: Date;
};

export const LockerSchema: Schema = new Schema<ILocker>({
    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    bloqId: {
        type: String,
        required: true,
        ref: 'Bloq'
    },
    status: {
        type: String,
        enum: LockerStatus,
        required: true
    },
    isOccupied: {
        type: Boolean,
        required: true,
        default: false
    }

}, {
    timestamps: true,
    collection: 'Locker',
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
})

const Locker: Model<ILocker> = model<ILocker>('Locker', LockerSchema);
export default Locker;