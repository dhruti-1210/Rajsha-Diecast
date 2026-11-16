import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
    companyName: string;
    companyLogo: string;
    modelCount: number;
    scaleSize: number;

    createdAt: Date;
    updatedAt: Date;
    updatedBy: string;
    createdBy: string;
    isActive: boolean;
    isDeleted: boolean;
}

const CompanySchema: Schema = new Schema(
    {
        companyName: {
            type: String,
            required: true
        },
        companyLogo: {
            type: String,
            required: true
        },  
        modelCount: {
            type: Number,
            required: true
        },
        scaleSize: {
            type: Number,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        updatedBy: {
            type: String,
            required: true
        },
        createdBy: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    }
)


const Company = mongoose.model<ICompany>('Company', CompanySchema);

export default Company;
