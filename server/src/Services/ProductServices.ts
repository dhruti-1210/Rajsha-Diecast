
import ProductMaster, { IProductMaster } from "../Models/ProductMaster";

// Create Product
export const CreateProductMaster = async (data: Partial<IProductMaster>) => {
    try {
        const product = new ProductMaster(data);
        return await product.save();
    } catch (error) {
        throw error;
    }
};

// Get All Products
export const GetAllProductMaster = async () => {
    try {
        return await ProductMaster.find({ isDeleted: false }).sort({ createdAt: -1 });
    } catch (error) {
        throw error;
    }
};

// Get Product By ID
export const GetProductMasterById = async (id: string) => {
    try {
        return await ProductMaster.findOne({
            _id: id,
            isDeleted: false
        });
    } catch (error) {
        throw error;
    }
};

// Update Product
export const UpdateProductMaster = async (
    id: string,
    data: Partial<IProductMaster>
) => {
    try {
        return await ProductMaster.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                ...data,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        );
    } catch (error) {
        throw error;
    }
};

// Soft Delete Product
export const DeleteProductMaster = async (id: string, updatedBy: string) => {
    try {
        return await ProductMaster.findOneAndUpdate(
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
export const ChangeProductActiveStatus = async (
    id: string,
    isActive: boolean,
    updatedBy: string
) => {
    try {
        return await ProductMaster.findOneAndUpdate(
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

// Change Display Status
export const ChangeProductDisplayStatus = async (
    id: string,
    isDisplay: boolean,
    updatedBy: string
) => {
    try {
        return await ProductMaster.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                isDisplay,
                updatedBy,
                updatedAt: new Date()
            },
            { new: true }
        );
    } catch (error) {
        throw error;
    }
};
