import { Document, model, Model, Schema } from "mongoose";
import { v4 as uuidv4 } from 'uuid';


// I assume we do not want duplicate Bloq names for clarity purposes
// So I added a unique on the title
export interface IBloq extends Document {
    id: string;
    title: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
};

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
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }

})

const Bloq: Model<IBloq> = model<IBloq>('Bloq', BloqSchema);
export default Bloq;