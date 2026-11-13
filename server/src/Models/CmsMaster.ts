
import mongoose, { Schema, Document } from "mongoose";

export interface ICmsMaster extends Document {
    Name: string;
    Description: string;

    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;

    isActive: boolean;
    isDisplay: boolean;
    isDeleted: boolean;
}

const CmsMasterSchema: Schema = new Schema(
    {
        Name: {
            type: String,
            required: true,
            trim: true
        },
        Description: {
            type: String,
            default: ""
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        createdBy: {
            type: String,
            required: true
        },
        updatedBy: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isDisplay: {
            type: Boolean,
            default: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    }
);

const CmsMaster = mongoose.model<ICmsMaster>(
    "CmsMaster",
    CmsMasterSchema
);

export default CmsMaster;
