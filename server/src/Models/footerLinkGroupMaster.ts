import mongoose, { Schema, Document } from "mongoose";

export interface IFooterLinkGroup extends Document {
    FooterLinkGroupName: string;

    createdAt: Date;
    updatedAt: Date;
    updatedBy: string;
    createdBy: string;

    isActive: boolean;
    isDisplay: boolean;
    isDeleted: boolean;
}

const FooterLinkGroupSchema: Schema = new Schema(
    {
        FooterLinkGroupName: {
            type: String,
            required: true,
            trim: true
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

const FooterLinkGroup = mongoose.model<IFooterLinkGroup>(
    "FooterLinkGroup",
    FooterLinkGroupSchema
);

export default FooterLinkGroup;