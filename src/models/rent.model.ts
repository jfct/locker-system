import { Document, model, Model, Schema } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import { RentSize, RentStatus } from "../types/rent";

// I left updatedAt because both created and this are automatically managed by mongoose
// once you activate the timestamps on the schema
export interface IRent extends Document {
    id: string;
    weight: number;
    size: RentSize;
    status: RentStatus;
    createdAt: Date;
    updatedAt: Date;
    lockerId?: string;
    droppedOffAt?: Date;
    pickedUpAt?: Date;
};

export const RentSchema: Schema = new Schema<IRent>({
    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    lockerId: {
        type: String,
        required: false,
        ref: 'Locker'
    },
    weight: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        enum: RentSize,
        required: true
    },
    status: {
        type: String,
        enum: RentStatus,
        required: true
    },
    droppedOffAt: {
        type: Date,
        required: false
    },
    pickedUpAt: {
        type: Date,
        required: false
    }
}, {
    timestamps: true,
    collection: 'Rent',
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
})

const Rent: Model<IRent> = model<IRent>('Rent', RentSchema);
export default Rent;