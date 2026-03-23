import { configureStore } from "@reduxjs/toolkit";
import invoiceWithAiReducer from "./features/invoice-with-ai.slice";

export const store = configureStore({
  reducer: {
    invoiceWithAi: invoiceWithAiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // disables serializable check
    }),
});

// ✅ Inferred types for state & dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;