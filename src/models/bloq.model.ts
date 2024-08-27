import { Document, model, Model, Schema } from "mongoose";

// I assume we do not want duplicate Bloq names for clarity purposes
// So I added a unique on the title
export interface IBloq extends Document {
    id: Schema.Types.ObjectId;
    title: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
};

export const BloqSchema: Schema = new Schema<IBloq>({
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
    _id: false,
    timestamps: true
})

const Bloq: Model<IBloq> = model<IBloq>('Bloq', BloqSchema);
export default Bloq;