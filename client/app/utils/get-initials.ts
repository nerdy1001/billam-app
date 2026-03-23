/**
 * Gets the initials from a full name.
 * @param name - The full name string (e.g., "Orchard Technologies")
 * @returns string - The initials (e.g., "OT")
 */
export const getInitials = (name: string | undefined | null): string => {
  if (!name) return "";

  // 1. Trim whitespace and split by one or more spaces
  const parts = name.trim().split(/\s+/);

  // 2. Map through parts and take the first character
  const initials = parts
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  // 3. Optional: Limit to first 2 characters for standard avatar look
  return initials.slice(0, 2);
};