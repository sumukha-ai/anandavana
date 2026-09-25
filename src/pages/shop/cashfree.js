// Cashfree hosted checkout. The backend decides the mode: each order it creates says whether to run
// the SDK in "sandbox" or "production", or "mock" when no gateway is configured (payment stays pending).
import { useEffect, useState } from "react";
import { apiRequest } from "../../api/client";

const SDK_URL = "https://sdk.cashfree.com/js/v3/cashfree.js";
const SDK_MODES = ["sandbox", "production"];

let sdkPromise = null;
let configPromise = null;

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

function fetchPaymentConfig() {
  if (!configPromise) {
    configPromise = apiRequest("/payments/config").catch((err) => {
      configPromise = null;
      throw err;
    });
  }
  return configPromise;
}

// Whether real payments are taken. Assumes live until the backend says otherwise,
// so the test-mode note never flashes on a live site.
export function useLivePayments() {
  const [live, setLive] = useState(true);
  useEffect(() => {
    let active = true;
    fetchPaymentConfig()
      .then((config) => active && setLive(Boolean(config?.live_payments)))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  return live;
}

// payment: the `payment` object the backend returns with a booking or donation.
// Resolves to "paid" (checkout finished; the server still confirms), "cancelled",
// "redirect" (Cashfree is taking the browser to the return URL), or "skipped" (mock mode).
export async function collectPayment(payment) {
  const mode = payment?.environment;
  if (!SDK_MODES.includes(mode) || !payment?.payment_session_id) return "skipped";
  const Cashfree = await loadSdk();
  const cashfree = Cashfree({ mode });
  const result = await cashfree.checkout({ paymentSessionId: payment.payment_session_id, redirectTarget: "_modal" });
  if (result?.redirect) return "redirect";
  if (result?.paymentDetails) return "paid";
  return "cancelled";
}
