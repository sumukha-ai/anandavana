// Cashfree hosted checkout. Enabled only when VITE_CASHFREE_MODE is "sandbox" or "production";
// without it the booking is recorded and payment stays pending, as before.
const CASHFREE_MODE = import.meta.env.VITE_CASHFREE_MODE;
const SDK_URL = "https://sdk.cashfree.com/js/v3/cashfree.js";

let sdkPromise = null;

export function isOnlinePaymentEnabled() {
  return CASHFREE_MODE === "sandbox" || CASHFREE_MODE === "production";
}

function loadSdk() {
  if (window.Cashfree) return Promise.resolve(window.Cashfree);
  if (!sdkPromise) {
    sdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = SDK_URL;
      script.async = true;
      script.onload = () => (window.Cashfree ? resolve(window.Cashfree) : reject(new Error("Cashfree unavailable")));
      script.onerror = () => {
        sdkPromise = null;
        reject(new Error("Cashfree unavailable"));
      };
      document.head.appendChild(script);
    });
  }
  return sdkPromise;
}

// Resolves to "paid", "cancelled", or "skipped" (payments not enabled / no session)
export async function collectPayment(paymentSessionId) {
  if (!isOnlinePaymentEnabled() || !paymentSessionId) return "skipped";
  const Cashfree = await loadSdk();
  const cashfree = Cashfree({ mode: CASHFREE_MODE });
  const result = await cashfree.checkout({ paymentSessionId, redirectTarget: "_modal" });
  if (result?.error) return "cancelled";
  if (result?.paymentDetails) return "paid";
  return "cancelled";
}
