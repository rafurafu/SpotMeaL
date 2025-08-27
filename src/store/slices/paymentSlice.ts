import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Payment } from '../../types';

interface PaymentState {
  payments: Payment[];
  currentPayment: Payment | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  payments: [],
  currentPayment: null,
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPayments: (state, action: PayloadAction<Payment[]>) => {
      state.payments = action.payload;
    },
    addPayment: (state, action: PayloadAction<Payment>) => {
      state.payments.push(action.payload);
    },
    setCurrentPayment: (state, action: PayloadAction<Payment>) => {
      state.currentPayment = action.payload;
    },
    updatePaymentStatus: (state, action: PayloadAction<{ id: string; status: Payment['status'] }>) => {
      const payment = state.payments.find(p => p.id === action.payload.id);
      if (payment) {
        payment.status = action.payload.status;
      }
      if (state.currentPayment && state.currentPayment.id === action.payload.id) {
        state.currentPayment.status = action.payload.status;
      }
    },
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setPayments,
  addPayment,
  setCurrentPayment,
  updatePaymentStatus,
  clearCurrentPayment,
} = paymentSlice.actions;

export default paymentSlice.reducer;