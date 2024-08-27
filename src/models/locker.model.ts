import { Document, model, Model, Schema } from "mongoose";
import { LockerStatus } from "../types/locker";

export interface ILocker extends Document {
    id: Schema.Types.ObjectId;
    bloqId: Schema.Types.ObjectId;
    status: LockerStatus;
    isOccupied: Boolean;
    createdAt: Date;
    updatedAt: Date;
};

export const LockerSchema: Schema = new Schema<ILocker>({
    bloqId: {
        type: Schema.Types.ObjectId,
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
    timestamps: true
})

const Locker: Model<ILocker> = model<ILocker>('Locker', LockerSchema);
export default Locker;