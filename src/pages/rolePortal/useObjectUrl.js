import { useEffect, useState } from "react";

/*
 * A blob URL for a local File, revoked when the file changes or the component
 * unmounts. The URL is made inside the effect (not in useMemo) so StrictMode's
 * mount → unmount → mount cycle can't leave the component holding a revoked URL.
 */
export function useObjectUrl(file) {
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    if (!file) return undefined;
    const url = URL.createObjectURL(file);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the URL must live and die with this effect
    setEntry({ file, url });
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return entry && entry.file === file ? entry.url : null;
}
