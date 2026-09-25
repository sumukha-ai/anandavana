import { useEffect, useState } from "react";
import { apiRequest } from "../../../api/client";

// Loads `path` (skipped when null) and keeps the last result on screen while the next one loads.
// `loading` is true until the response for the current path and reload count has arrived.
export function useFinanceQuery(path, { token, notify, errorTitle, reload = 0 }) {
  const key = path ? `${path}#${reload}` : null;
  const [state, setState] = useState({ key: null, data: null });

  useEffect(() => {
    if (!key) return undefined;
    let active = true;
    apiRequest(path, { token })
      .then((data) => active && setState({ key, data }))
      .catch((err) => {
        if (!active) return;
        setState((current) => ({ key, data: current.data }));
        notify("error", errorTitle, err.message);
      });
    return () => {
      active = false;
    };
  }, [errorTitle, key, notify, path, token]);

  return { data: state.data, loading: Boolean(key) && state.key !== key };
}
