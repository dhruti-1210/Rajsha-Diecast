import cors from "cors";
import express from "express";

import BannerRoutes from "./Routes/BannerRoutes";
import BudgetRoutes from "./Routes/BudgetRoutes";
import CMSRoutes from "./Routes/CMSRoutes";
import UserRoutes from "./Routes/UserRoutes";

import CollectionMasterRoutes from "./Routes/CollectionMaster";
import CompanyMasterRoutes from "./Routes/CompanyMaster";

import OrderLineRoutes from "./Routes/OrderLineRoutes";
import OrderMasterRoutes from "./Routes/OrderMasterRoutes";

import packageTypeRoutes from "./Routes/PackagingTypeRoutes";
import ProductMasterRoutes from "./Routes/ProductMasterRoutes";

import TransactionHistoryRoutes from "./Routes/TransactionHistoryRoutes";
import ReviewRoutes from "./Routes/ReviewRoutes";

import ProductImgRoutes from "./Routes/ProductImgRoutes";
const app = express(); 

app.use(cors({ origin: process.env.CLIENT_URL || true }));
app.use(express.json());

app.use("/api/banners", BannerRoutes);
app.use("/api/budgets", BudgetRoutes);
app.use("/api/cms", CMSRoutes);
app.use("/api/users", UserRoutes);

app.use("/api/collection-types", CollectionMasterRoutes);
app.use("/api/companies", CompanyMasterRoutes);

app.use("/api/order-lines", OrderLineRoutes);
app.use("/api/orders", OrderMasterRoutes);

app.use("/api/packaging-types", packageTypeRoutes);
app.use("/api/products", ProductMasterRoutes);

app.use("/api/reviews", ReviewRoutes);
app.use("/api/transaction-history", TransactionHistoryRoutes);

app.use("/api/product-images", ProductImgRoutes);

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

export default app;
