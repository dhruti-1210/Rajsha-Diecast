import mongoose, { Schema, Document } from "mongoose";

export interface IBudgetMaster extends Document {
    minAmount: number;
    maxAmount?: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    updatedBy?: string;
    isActive: boolean;
    isDeleted: boolean;
}

const BudgetMasterSchema = new Schema<IBudgetMaster>(
    {
        minAmount: { type: Number, required: true, min: 0 },
        maxAmount: { type: Number, min: 0 },
        createdBy: { type: String, trim: true },
        updatedBy: { type: String, trim: true },
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

BudgetMasterSchema.index({ isDeleted: 1, isActive: 1, minAmount: 1, maxAmount: 1, createdAt: -1 });

const BudgetMaster = mongoose.model<IBudgetMaster>("BudgetMaster", BudgetMasterSchema);
export default BudgetMaster;
