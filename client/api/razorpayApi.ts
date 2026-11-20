import api from './axiosApi';
import type { OrderMaster, OrderMasterApiResponse } from '@/types/orderMaster';

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

interface RazorpayCreateOrderResponse {
  success: boolean;
  message: string;
  data: {
    order: RazorpayOrder;
    key: string;
  };
}

export interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const createRazorpayOrder = async () => {
  const response = await api.post<RazorpayCreateOrderResponse>('/payment/create-order');
  return response.data;
};

export const verifyRazorpayPayment = async (payment: RazorpayPaymentResponse) => {
  const response = await api.post<OrderMasterApiResponse<OrderMaster>>(
    '/payment/verify',
    payment,
  );
  return response.data;
};