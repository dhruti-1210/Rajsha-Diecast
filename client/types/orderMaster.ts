export interface OrderProductSummary {
  _id: string;
  Name: string;
  BrandName?: string;
  ModelCode?: string;
  Size?: string;
  Image?: string[];
}

export interface OrderLineSummary {
  _id: string;
  Price: number;
  product_ID: OrderProductSummary | string | null;
}

export interface OrderCheckoutStatus {
  isPLACED: boolean;
  isPROCESSING: boolean;
  isSHIPPED: boolean;
  isTransist: boolean;
  isDELIVERED: boolean;
}

export interface OrderMaster {
  _id: string;
  user_id: string;
  Total: number;
  PaymentStatus: string;
  TrackingId: string;
  createdAt: string;
  updatedAt: string;
  items: OrderLineSummary[];
  checkout: OrderCheckoutStatus | null;
}

export interface OrderMasterApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
