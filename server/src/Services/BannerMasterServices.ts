
import Banner, { IBanner } from "../Models/BannerMaster";

// Create Banner
export const createBanner = async (data: Partial<IBanner>) => {
    try {
        const banner = new Banner(data);
        return await banner.save();
    } catch (error) {
        throw error;
    }
};

// Get All Banners
export const getAllBanners = async () => {
    try {
        return await Banner.find({
            isDeleted: false
        }).sort({ createdAt: -1 });
    } catch (error) {
        throw error;
    }
};

// Get Banner By ID
export const getBannerById = async (id: string) => {
    try {
        return await Banner.findOne({
            _id: id,
            isDeleted: false
        });
    } catch (error) {
        throw error;
    }
};

// Update Banner
export const updateBanner = async (
    id: string,
    data: Partial<IBanner>
) => {
    try {
        return await Banner.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false
            },
            {
                ...data,
                updatedAt: new Date()
            },
            {
                new: true,
                runValidators: true
            }
        );
    } catch (error) {
        throw error;
    }
};

// Soft Delete Banner
export const deleteBanner = async (
    id: string,
    updatedBy: string
) => {
    try {
        return await Banner.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false
            },
            {
                isDeleted: true,
                updatedBy,
                updatedAt: new Date()
            },
            {
                new: true
            }
        );
    } catch (error) {
        throw error;
    }
};

// Change Banner Status
export const changeBannerStatus = async (
    id: string,
    isActive: boolean,
    updatedBy: string
) => {
    try {
        return await Banner.findOneAndUpdate(
            {
                _id: id,
                isDeleted: false
            },
            {
                isActive,
                updatedBy,
                updatedAt: new Date()
            },
            {
                new: true
            }
        );
    } catch (error) {
        throw error;
    }
};
