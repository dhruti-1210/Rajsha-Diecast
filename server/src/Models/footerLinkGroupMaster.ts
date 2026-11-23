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
            trim: true,
            maxlength: 120
        },
        createdBy: {
            type: String,
            required: true,
            trim: true
        },
        updatedBy: {
            type: String,
            required: true,
            trim: true
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
    },
    {
        timestamps: true
    }
);

FooterLinkGroupSchema.index({ isDeleted: 1, isActive: 1, isDisplay: 1, createdAt: -1 });
FooterLinkGroupSchema.index({ FooterLinkGroupName: 1 });

const FooterLinkGroup = mongoose.model<IFooterLinkGroup>(
    "FooterLinkGroup",
    FooterLinkGroupSchema
);

export default FooterLinkGroup;
