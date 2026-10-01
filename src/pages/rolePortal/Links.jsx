import { useCallback, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { Printer, ReceiptText } from "lucide-react";
import SevaReceipt from "../shop/SevaReceipt";
import { Drawer } from "./finance/FinanceParts";
import { ReceiptContext, canOpenProfiles, useSevaReceipt } from "./receiptContext";
import { sectionPath } from "./rolePortalConfig";
import { cx } from "./cx";
import styles from "./Console.module.css";
import fin from "./finance/Finance.module.css";
import shop from "../shop/Shop.module.css";

// Holds the one seva-receipt drawer for the whole console. Printing with it open prints only the receipt.
export function ReceiptProvider({ children }) {
  const [booking, setBooking] = useState(null);
  const close = useCallback(() => setBooking(null), []);
  const value = useMemo(() => ({ open: setBooking }), []);

  return (
    <ReceiptContext.Provider value={value}>
      <div className={fin.receiptHost}>
        {children}
        <Drawer
          open={Boolean(booking)}
          wide
          className={fin.receiptLayer}
          title="Seva receipt"
          subtitle={booking?.seva?.name}
          onClose={close}
          footer={
            <>
              <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={close}>
                Close
              </button>
              <button type="button" className={cx(styles.btn, styles.btnPrimary)} onClick={() => window.print()}>
                <Printer size={15} aria-hidden="true" />
                Print
              </button>
            </>
          }
        >
          {booking ? (
            <div className={cx(shop.shop, fin.receiptSheet)}>
              <SevaReceipt booking={booking} titleAs="h3" />
            </div>
          ) : null}
        </Drawer>
      </div>
    </ReceiptContext.Provider>
  );
}

// A person's name. Opens their bhakta profile when there is one this role may see; plain text otherwise.
export function PersonLink({ lang, role, bhaktaId, children, className }) {
  if (bhaktaId === null || bhaktaId === undefined || !canOpenProfiles(role)) {
    return <span className={className}>{children}</span>;
  }
  return (
    <NavLink to={`${sectionPath(lang, role, "bhaktas")}/${bhaktaId}`} className={cx(styles.personLink, className)} onClick={(event) => event.stopPropagation()}>
      {children}
    </NavLink>
  );
}

// A seva on a booking. Opens that booking's receipt.
export function ReceiptLink({ booking, children, className, label }) {
  const receipt = useSevaReceipt();
  if (!receipt || !booking) return <span className={className}>{children}</span>;
  return (
    <button
      type="button"
      className={cx(styles.receiptLink, className)}
      onClick={(event) => {
        event.stopPropagation();
        receipt.open(booking);
      }}
      aria-label={label}
    >
      {children}
    </button>
  );
}

// A compact "Receipt" action for rows where the seva name is not on the row itself
export function ReceiptButton({ booking }) {
  const receipt = useSevaReceipt();
  if (!receipt || !booking) return null;
  return (
    <button
      type="button"
      className={styles.addressToggle}
      onClick={(event) => {
        event.stopPropagation();
        receipt.open(booking);
      }}
      aria-label={`Open receipt for ${booking.seva?.name || "this seva"}${booking.bhakta_profile?.name ? `, ${booking.bhakta_profile.name}` : ""}`}
    >
      <ReceiptText size={13} aria-hidden="true" />
      Receipt
    </button>
  );
}
