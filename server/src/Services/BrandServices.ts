import Brand, { IBrand } from "../Models/BrandMaster";

// Create Brand
export const CreateBrand = async (data: Partial<IBrand>) => {
    try {
        const { brandLogo: _brandLogo, ...brandData } = data as Partial<IBrand> & { brandLogo?: string };
        const brand = new Brand(brandData);
        return await brand.save();
    } catch (error) {
        throw error;
    }
};

// Get All Brands
export const GetAllBrands = async () => {
    try {
        return await Brand.find({ isDeleted: false }).sort({ createdAt: -1 });
    } catch (error) {
        throw error;
    }
};

// Get Company By ID
export const GetBrandById = async (id: string) => {
    try {
        return await Brand.findOne({ _id: id, isDeleted: false });
    } catch (error) {
        throw error;
    }
};

// Update Brand
export const UpdateBrand = async (id: string, data: Partial<IBrand>) => {
    try {
        const { brandLogo: _brandLogo, ...brandData } = data as Partial<IBrand> & { brandLogo?: string };
        return await Brand.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                $set: {
                    ...brandData,
                    updatedAt: new Date()
                },
                $unset: { brandLogo: "" }
            },
            { new: true, runValidators: true }
        );
    } catch (error) {
        throw error;
    }
};

// Soft Delete Brand
export const DeleteBrand = async (id: string, updatedBy: string) => {
    try {
        return await Brand.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                isDeleted: true,
                updatedBy,
                updatedAt: new Date()
            },
            { new: true }
        );
    } catch (error) {
        throw error;
    }
};

// Change Active Status
export const ChangeActiveStatus = async (
    id: string,
    isActive: boolean,
    updatedBy: string
) => {
    try {
        return await Brand.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                isActive,
                updatedBy,
                updatedAt: new Date()
            },
            { new: true }
        );
    } catch (error) {
        throw error;
    }
};
