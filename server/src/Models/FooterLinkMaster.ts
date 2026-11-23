import mongoose, { Schema, Document } from "mongoose";

export interface IFooterLinkMaster extends Document {
    FooterLinkGroupId: mongoose.Types.ObjectId;
    FooterLinkName: string;
    FooterLinkUrl: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    updatedBy?: string;
    isActive: boolean;
    isDisplay: boolean;
    isDeleted: boolean;
}

const FooterLinkMasterSchema = new Schema<IFooterLinkMaster>(
    {
        FooterLinkGroupId: {
            type: Schema.Types.ObjectId,
            ref: "FooterLinkGroup",
            required: true,
            index: true
        },
        FooterLinkName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150
        },
        FooterLinkUrl: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500
        },
        createdBy: {
            type: String,
            trim: true
        },
        updatedBy: {
            type: String,
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

FooterLinkMasterSchema.index({ isDeleted: 1, isActive: 1, isDisplay: 1, createdAt: -1 });
FooterLinkMasterSchema.index({ FooterLinkName: 1, FooterLinkUrl: 1 });

const FooterLinkMaster = mongoose.model<IFooterLinkMaster>(
    "FooterLinkMaster",
    FooterLinkMasterSchema
);

export default FooterLinkMaster;
