import mongoose, { Schema, Document } from "mongoose";

export interface ICmsMaster extends Document {
    Name: string;
    Description: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    updatedBy?: string;
    isActive: boolean;
    isDisplay: boolean;
    isDeleted: boolean;
}

const CmsMasterSchema: Schema = new Schema(
    {
        Name: { type: String, required: true, trim: true },
        Description: { type: String, default: "" },
        createdBy: { type: String, trim: true },
        updatedBy: { type: String, trim: true },
        isActive: { type: Boolean, default: true },
        isDisplay: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

CmsMasterSchema.index({ isDeleted: 1, isActive: 1, isDisplay: 1, createdAt: -1 });
CmsMasterSchema.index({ Name: 1 });

const CmsMaster = mongoose.model<ICmsMaster>("CmsMaster", CmsMasterSchema);
export default CmsMaster;
