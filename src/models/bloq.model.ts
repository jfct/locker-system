import { Document, model, Model, Schema } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import { ILocker } from "./locker.model";
import { schemaOptions } from "./schema-options";

export interface Bloq {
    title: string;
    address: string;
}

// I assume we do not want duplicate Bloq names for clarity purposes
// So I added a unique on the title
export interface IBloq extends Bloq, Document {
    id: string;
    createdAt: Date;
    updatedAt: Date;
};

export interface IBloqPopulated extends IBloq {
    lockers: ILocker[]
}

export const BloqSchema: Schema = new Schema<IBloq>({
    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
    collection: 'Bloq',
    ...schemaOptions
})

// Virtual field for lockers
BloqSchema.virtual('lockers', {
    ref: 'Locker',
    localField: 'id',
    foreignField: 'bloqId'
});

const BloqModel: Model<IBloq> = model<IBloq>('Bloq', BloqSchema);
export default BloqModel;