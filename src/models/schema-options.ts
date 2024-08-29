import { Document } from "mongoose";

// Using the same types that are defined when we are using the mongo properties, this includes the record<string, any>
export const schemaOptions = {
    toJSON: {
        virtuals: true,
        transform: function (doc: Document, ret: Record<string, any>) {
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    },
    toObject: {
        virtuals: true,
        transform: function (doc: Document, ret: Record<string, any>) {
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
}