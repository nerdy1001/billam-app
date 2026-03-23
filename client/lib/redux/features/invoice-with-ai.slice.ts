import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { InvoiceFormValues } from '@/lib/validations/invoice.validation';

// Use the invoice form schema type for parsed data
export type ParsedInvoiceData = InvoiceFormValues;

// State interface
export interface InvoiceWithAiState {
  data: ParsedInvoiceData | null;
  error: string | null;
  loading: boolean;
}

// Initial state
const initialState: InvoiceWithAiState = {
  data: null,
  error: null,
  loading: false,
};

// Slice definition
const invoiceWithAiSlice = createSlice({
  name: 'invoiceWithAi',
  initialState,
  reducers: {
    // Action to set the parsed invoice data
    setInvoiceData: (state, action: PayloadAction<ParsedInvoiceData>) => {
      state.data = action.payload;
      state.error = null;
      state.loading = false;
    },

    // Action to set an error message
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.data = null;
      state.loading = false;
    },

    // Action to set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      if (action.payload) {
        // Clear previous data/error when starting to load
        state.data = null;
        state.error = null;
      }
    },

    // Action to clear all data
    clearData: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
});

// Export actions
export const { setInvoiceData, setError, setLoading, clearData } = invoiceWithAiSlice.actions;

// Export reducer
export default invoiceWithAiSlice.reducer;

// Export selector functions for use in components
export const selectInvoiceWithAiData = (state: { invoiceWithAi: InvoiceWithAiState }) =>
  state.invoiceWithAi.data;

export const selectInvoiceWithAiError = (state: { invoiceWithAi: InvoiceWithAiState }) =>
  state.invoiceWithAi.error;

export const selectInvoiceWithAiLoading = (state: { invoiceWithAi: InvoiceWithAiState }) =>
  state.invoiceWithAi.loading;
