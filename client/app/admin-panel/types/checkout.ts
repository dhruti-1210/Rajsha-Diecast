export type CheckoutStage =
  | 'isPLACED'
  | 'isPROCESSING'
  | 'isSHIPPED'
  | 'isTransist'
  | 'isDELIVERED';

export interface CheckoutOrderSummary {
  _id: string;
  Total?: number;
  PaymentStatus?: string;
  TrackingId?: string;
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
