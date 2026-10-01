import { createContext, useContext } from "react";

export const ReceiptContext = createContext(null);

// Opens the shared seva-receipt drawer from anywhere inside the console
export function useSevaReceipt() {
  return useContext(ReceiptContext);
}

// Only admins and managers have bhakta profiles to open
export function canOpenProfiles(role) {
  return role === "admin" || role === "manager";
}

// The bhakta account a booking belongs to. A booking for a family member still
// opens the account holder's profile, where the family member is listed.
export function bhaktaIdOf(booking) {
  if (!booking) return null;
  const profile = booking.bhakta_profile || {};
  return booking.user_id ?? booking.bhakta_id ?? profile.user_id ?? profile.bhakta_id ?? booking.user?.id ?? booking.bhakta?.id ?? null;
}
