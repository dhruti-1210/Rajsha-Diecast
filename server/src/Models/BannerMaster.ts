import mongoose, { Schema, Document } from 'mongoose';

export interface IBanner extends Document {
    BannerImg: string;
    BannerTitle: string;
    BannerSubTitle: string;
    createdAt: Date;
    updatedAt: Date;
    updatedBy?: string;
    createdBy?: string;
    isActive: boolean;
    isDeleted: boolean;
}

const BannerSchema: Schema = new Schema(
    {
        BannerImg: { type: String, required: true, trim: true },
        BannerTitle: { type: String, required: true, trim: true },
        BannerSubTitle: { type: String, required: true, trim: true },
        createdBy: { type: String, trim: true },
        updatedBy: { type: String, trim: true },
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

BannerSchema.index({ isDeleted: 1, isActive: 1, createdAt: -1 });
BannerSchema.index({ BannerTitle: 1 });

const Banner = mongoose.model<IBanner>('Banner', BannerSchema);
export default Banner;
