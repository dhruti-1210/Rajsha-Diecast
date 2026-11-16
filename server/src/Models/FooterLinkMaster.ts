
import mongoose, { Schema, Document } from "mongoose";

export interface IFooterLinkMaster extends Document {
    FooterLinkGroupId: mongoose.Types.ObjectId;
    FooterLinkName: string;
    FooterLinkUrl: string;

    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;

    isActive: boolean;
    isDisplay: boolean;
    isDeleted: boolean;
}

const FooterLinkMasterSchema = new Schema<IFooterLinkMaster>(
    {
        FooterLinkGroupId: {
            type: Schema.Types.ObjectId,
            ref: "FooterLinkGroup",
            required: true
        },
        FooterLinkName: {
            type: String,
            required: true
        },
        FooterLinkUrl: {
            type: String,
            required: true
        },
        createdBy: {
            type: String
        },
        updatedBy: {
            type: String
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

const FooterLinkMaster = mongoose.model<IFooterLinkMaster>(
    "FooterLinkMaster",
    FooterLinkMasterSchema
);

export default FooterLinkMaster;
