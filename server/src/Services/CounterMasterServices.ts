import { ICounterMaster } from "../Models/CounterMaster";
import BrandMaster from "../Models/BrandMaster";
import CollectionType from "../Models/CollectionTypeMaster";
import ProductMaster from "../Models/ProductMaster";
import UserMaster from "../Models/userMaster";

type CounterData = Pick<
    ICounterMaster,
    | "counterTitle"
    | "counterValue"
    | "counterSuffix"
    | "counterLabel"
    | "sortOrder"
    | "createdAt"
    | "updatedAt"
    | "createdBy"
    | "updatedBy"
    | "isActive"
    | "isDisplay"
>;

export const GetCounterMaster = async (): Promise<CounterData[]> => {
    const [modelsInStock, topBrands, happyCollectors, premiumCollections] =
        await Promise.all([
            ProductMaster.countDocuments({
                isDeleted: false,
                TotalStock: { $gt: 0 }
            }),
            BrandMaster.countDocuments({ isDeleted: false }),
            UserMaster.countDocuments({ isDeleted: false }),
            CollectionType.countDocuments({ isDeleted: false })
        ]);

    const now = new Date();
    const counters = [
        {
            counterTitle: "Models in Stock",
            counterValue: modelsInStock,
            counterSuffix: "+",
            counterLabel: "MODELS IN STOCK",
            sortOrder: 1
        },
        {
            counterTitle: "Top Brands",
            counterValue: topBrands,
            counterSuffix: "+",
            counterLabel: "TOP BRANDS",
            sortOrder: 2
        },
        {
            counterTitle: "Happy Collectors",
            counterValue: happyCollectors,
            counterSuffix: "+",
            counterLabel: "HAPPY COLLECTORS",
            sortOrder: 3
        },
        {
            counterTitle: "Premium Collections",
            counterValue: premiumCollections,
            counterSuffix: "+",
            counterLabel: "PREMIUM COLLECTIONS",
            sortOrder: 4
        }
    ];

    return counters.map((counter) => ({
        ...counter,
        createdAt: now,
        updatedAt: now,
        createdBy: "system",
        updatedBy: "system",
        isActive: true,
        isDisplay: true
    }));
};
