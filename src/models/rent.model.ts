import { Document, model, Model, Schema } from "mongoose";
import { RentSize, RentStatus } from "../types/rent";

// I left updatedAt because both created and this are automatically managed by mongoose
// once you activate the timestamps on the schema
export interface IRent extends Document {
    id: Schema.Types.ObjectId;
    weight: number;
    size: RentSize;
    status: RentStatus;
    createdAt: Date;
    updatedAt: Date;
    lockerId?: Schema.Types.ObjectId;
    droppedOffAt?: Date;
    pickedUpAt?: Date;
};

export const RentSchema: Schema = new Schema<IRent>({
    lockerId: {
        type: Schema.Types.ObjectId,
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
    timestamps: true
})

const Rent: Model<IRent> = model<IRent>('Rent', RentSchema);
export default Rent;