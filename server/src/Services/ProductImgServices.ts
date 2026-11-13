import ProductImgMaster, { IProductImgMaster } from "../Models/ProductImgMaster";

// Create Product Image
export const CreateProductImgMaster = async (
    data: Partial<IProductImgMaster>
) => {
    try {
        const productImg = await ProductImgMaster.create(data);
        return productImg;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Get All Product Images
export const GetAllProductImgMaster = async () => {
    try {
        const productImgs = await ProductImgMaster.find({
            deletedAt: null
        }).sort({ createdAt: -1 });

        return productImgs;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Get Product Image By ID
export const GetProductImgMasterById = async (id: string) => {
    try {
        const productImg = await ProductImgMaster.findOne({
            _id: id,
            deletedAt: null
        });

        return productImg;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Get Product Images By Product ID
export const GetProductImgMasterByProductId = async (
    productId: string
) => {
    try {
        const productImgs = await ProductImgMaster.find({
            productId,
            deletedAt: null
        }).sort({ createdAt: -1 });

        return productImgs;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Update Product Image
export const UpdateProductImgMaster = async (
    id: string,
    data: Partial<IProductImgMaster>
) => {
    try {
        const productImg = await ProductImgMaster.findOneAndUpdate(
            {
                _id: id,
                deletedAt: null
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

        return productImg;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Delete Product Image (Soft Delete)
export const DeleteProductImgMaster = async (
    id: string,
    deletedBy: string
) => {
    try {
        const productImg = await ProductImgMaster.findOneAndUpdate(
            {
                _id: id,
                deletedAt: null
            },
            {
                deletedAt: new Date(),
                deletedBy,
                updatedAt: new Date(),
                updatedBy: deletedBy
            },
            { new: true }
        );

        return productImg;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Change Active Status
export const ChangeProductImgActiveStatus = async (
    id: string,
    isActive: boolean,
    updatedBy: string
) => {
    try {
        const productImg = await ProductImgMaster.findOneAndUpdate(
            {
                _id: id,
                deletedAt: null
            },
            {
                isActive,
                updatedBy,
                updatedAt: new Date()
            },
            { new: true }
        );

        return productImg;
    } catch (error: any) {
        throw new Error(error.message);
    }
};