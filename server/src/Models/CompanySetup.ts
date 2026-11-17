import mongoose, { Schema, Document } from "mongoose";

export interface ICompanySetup extends Document {
    CompanyName: string;
    companyLogo: string;
    ShippingCharges: number;
    FreeShippingCharge: number;
    OnlyNLeft: number;

    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;

    isActive: boolean;
    isDisplay: boolean;
    isDeleted: boolean;
}

const CompanySetupSchema: Schema = new Schema(
    {
        CompanyName: {
            type: String,
            required: true,
            trim: true
        },
        companyLogo: {
            type: String,
            required: true,
            trim: true
        },
        ShippingCharges: {
            type: Number,
            required: true,
            default: 0
        },
        FreeShippingCharge: {
            type: Number,
            required: true,
            default: 0
        },
        OnlyNLeft: {
            type: Number,
            required: true,
            default: 0
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
            default: false
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    }
);

const CompanySetup = mongoose.model<ICompanySetup>(
    "CompanySetup",
    CompanySetupSchema
);

export default CompanySetup;