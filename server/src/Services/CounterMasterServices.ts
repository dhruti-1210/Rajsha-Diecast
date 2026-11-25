import { ICounterMaster } from "../Models/CounterMaster";
import BrandMaster from "../Models/BrandMaster";
import CollectionType from "../Models/CollectionTypeMaster";
import ProductMaster from "../Models/ProductMaster";
import ReviewsMaster from "../Models/ReviewMaster";

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
    const [stockTotals, topBrands, happyCollectors, premiumCollectionTypes] =
        await Promise.all([
            ProductMaster.aggregate([
                {
                    $match: {
                        isDeleted: false,
                        isActive: true,
                        isDisplay: true,
                        $expr: {
                            $gt: [{ $ifNull: ["$stockRemaining", "$TotalStock"] }, 0]
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: { $ifNull: ["$stockRemaining", "$TotalStock"] } }
                    }
                }
            ]),
            BrandMaster.countDocuments({ isDeleted: false, isActive: true }),
            ReviewsMaster.countDocuments({ isDeleted: false }),
            CollectionType.find({
                collectionName: /^premium collection$/i,
                isDeleted: false,
                isActive: true,
                isDisplay: { $ne: false }
            }).select("_id").lean()
        ]);
    const modelsInStock = stockTotals[0]?.total ?? 0;
    const premiumCollectionFilters = premiumCollectionTypes.length
        ? [{
            Collectiontype_id: {
                $in: premiumCollectionTypes.map((collection) => collection._id)
            }
        }]
        : [];
    const premiumProductCount = await ProductMaster.countDocuments({
        isDeleted: false,
        isActive: true,
        isDisplay: true,
        $or: [
            ...premiumCollectionFilters,
            {
                Collectiontype_id: { $in: [null] },
                CollectionName: /^premium collection$/i
            }
        ]
    });

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
            counterValue: premiumProductCount,
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
