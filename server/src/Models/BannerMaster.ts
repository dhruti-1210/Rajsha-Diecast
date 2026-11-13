import mongoose, { Schema, Document } from 'mongoose';

export interface IBanner extends Document {
    BannerImg: string;
    BannerTitle: string;
    BannerSubTitle: string;

    createdAt: Date;
    updatedAt: Date;
    updatedBy: string;
    createdBy: string;
    isActive: boolean;
    isDeleted: boolean;
}

const BannerSchema: Schema = new Schema(
    {
        BannerImg: { 
            type: String, 
            required: true 
        },
        BannerTitle: { 
            type: String, 
            required: true 
        },
        BannerSubTitle: { 
            type: String, 
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
            type: String
        },
        createdBy: {
            type: String
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

const Banner = mongoose.model<IBanner>('Banner', BannerSchema);

export default Banner;
