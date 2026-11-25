export type CheckoutStage =
  | 'isPLACED'
  | 'isPROCESSING'
  | 'isSHIPPED'
  | 'isTransist'
  | 'isDELIVERED';

export interface CheckoutUser {
  _id?: string;
  name?: string;
  email?: string;
  mobile?: string;
  address?: string;
}

export interface CheckoutProduct {
  _id?: string;
  Name?: string;
  ModelCode?: string;
  BrandName?: string;
  Image?: string;
}

export interface CheckoutOrderItem {
  _id?: string;
  Quantity?: number;
  Price?: number;
  product_ID: string | CheckoutProduct | null;
}

export interface CheckoutTransaction {
  _id: string;
  order_Master_id?: string;
  user_id?: string | CheckoutUser | null;
  txnAmount?: number;
  transactionStatus?: string;
  gatewayName?: string;
  checksumHash?: string;
  initiatedAt?: string;
  completedAt?: string;
  createdAt?: string;
}

export interface CheckoutOrderSummary {
  _id: string;
  SubTotal?: number;
  ShippingCharge?: number;
  Total?: number;
  PaymentStatus?: string;
  TrackingId?: string;
  RazorpayPaymentId?: string;
  createdAt?: string;
  user_id?: string | CheckoutUser | null;
  items?: CheckoutOrderItem[];
  transactions?: CheckoutTransaction[];
}

export interface Checkout {
  _id: string;
  order_Master_id: string | CheckoutOrderSummary | null;
  isPLACED: boolean;
  isPROCESSING: boolean;
  isSHIPPED: boolean;
  isTransist: boolean;
  isDELIVERED: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
