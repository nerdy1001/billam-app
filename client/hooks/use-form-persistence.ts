import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

const STORAGE_KEY = "onboarding-form-data";

export function useFormPersistence<T extends Record<string, any>>(
  form: UseFormReturn<T>,
  key: string = STORAGE_KEY
) {
  // Restore saved data on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.entries(parsed).forEach(([field, value]) => {
          form.setValue(field as any, value as any, { shouldValidate: false });
        });
      }

    } catch {
      localStorage.removeItem(key);
    }
  }, []);

  // Save on every change
  useEffect(() => {
    const subscription = form.watch((values) => {
      try {
        localStorage.setItem(key, JSON.stringify(values));
      } catch {}
    });
    return () => subscription.unsubscribe();
  }, [form, key]);

  const clearPersistedData = () => localStorage.removeItem(key);

  return { clearPersistedData };
}
