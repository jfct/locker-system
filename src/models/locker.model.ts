import { Document, model, Model, Schema } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import { LockerStatus } from "../types/locker";
import { schemaOptions } from "./schema-options";

export interface Locker {
    bloqId: string;
    status: LockerStatus;
    isOccupied: Boolean;
}

export interface ILocker extends Locker, Document {
    id: string;
    createdAt: Date;
    updatedAt: Date;
};

export const LockerSchema: Schema = new Schema<ILocker>({
    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    // Immutable, a locker shouldnt be able to change from a bloq I believe
    bloqId: {
        type: String,
        required: true,
        ref: 'Bloq',
        immutable: true
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
    ...schemaOptions
})

// Virtual field for lockers
LockerSchema.virtual('rents', {
    ref: 'Rent',
    localField: 'id',
    foreignField: 'lockerId'
});

const LockerModel: Model<ILocker> = model<ILocker>('Locker', LockerSchema);
export default LockerModel;