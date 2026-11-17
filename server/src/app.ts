import cors from "cors";
import express from "express";

import BannerRoutes from "./Routes/BannerRoutes";
import BudgetRoutes from "./Routes/BudgetRoutes";
import CMSRoutes from "./Routes/CMSRoutes";
import UserRoutes from "./Routes/UserRoutes";

import CollectionMasterRoutes from "./Routes/CollectionMaster";
import BrandMasterRoutes from "./Routes/BrandMaster";

import OrderLineRoutes from "./Routes/OrderLineRoutes";
import OrderMasterRoutes from "./Routes/OrderMasterRoutes";

import packageTypeRoutes from "./Routes/PackagingTypeRoutes";
import ProductMasterRoutes from "./Routes/ProductMasterRoutes";

import TransactionHistoryRoutes from "./Routes/TransactionHistoryRoutes";
import ReviewRoutes from "./Routes/ReviewRoutes";

import ScaleSizeRoutes from "./Routes/ScaleSizeRoutes";
import CounterMasterRoutes from "./Routes/CounterMasterRoutes";

import CompanySetupRoutes from "./Routes/CompanySetupRoutes";
import CartRoutes from "./Routes/CartRoutes";

import CheckoutRoutes from "./Routes/CheckOutRoutes";
import FooterLinkGroupRoutes from "./Routes/footerLinkGroupRoutes";
import FooterLinkMasterRoutes from "./Routes/footerLinkRoutes";

import AdminUserRoutes from "./Routes/AdminRoutes";

const app = express(); 

const clientOrigin = (
  process.env.CLIENT_URL || "http://localhost:3001"
).replace(/\/+$/, "");

app.use(cors({
  origin: clientOrigin,
  credentials: true
}));
app.use("/api/products", express.json({ limit: "20mb" }));
app.use("/api/banners", express.json({ limit: "20mb" }));
app.use("/api/company-setup", express.json({ limit: "20mb" }));
app.use("/api/brands", express.json({ limit: "20mb" }));
app.use(express.json());

app.use("/api/banners", BannerRoutes);
app.use("/api/budgets", BudgetRoutes);
app.use("/api/cms", CMSRoutes);
app.use("/api/users", UserRoutes);

app.use("/api/collection-types", CollectionMasterRoutes);
app.use("/api/brands", BrandMasterRoutes);

app.use("/api/order-lines", OrderLineRoutes);
app.use("/api/orders", OrderMasterRoutes);

app.use("/api/packaging-types", packageTypeRoutes);
app.use("/api/products", ProductMasterRoutes);

app.use("/api/reviews", ReviewRoutes);
app.use("/api/transaction-history", TransactionHistoryRoutes);

app.use("/api/scale-sizes", ScaleSizeRoutes);
app.use("/api/counters", CounterMasterRoutes);


app.use("/api/company-setup", CompanySetupRoutes);
app.use("/api/cart", CartRoutes);

app.use("/api/checkout", CheckoutRoutes);
app.use("/api/footer-link-groups", FooterLinkGroupRoutes);
app.use("/api/footer-links", FooterLinkMasterRoutes);

app.use("/api/admin-users", AdminUserRoutes);

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

export default app;
