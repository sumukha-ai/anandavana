import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useI18n } from "../i18n/useI18n";
import shop from "./shop/Shop.module.css";
import styles from "./SevaBooking.module.css";
import { AssuranceStrip, Breadcrumbs, ErrorState, SevaCard, SevaCardSkeleton } from "./shop/ShopParts";
import { interpolate, isBookableOnline, useSevas } from "./shop/shopUtils";

const FILTERS = ["all", "online", "office"];
const SORTS = ["featured", "priceAsc", "priceDesc", "name"];

function sortSevas(list, sort, lang) {
  const sorted = [...list];
  const priceOf = (seva) => (Number(seva.amount) > 0 ? Number(seva.amount) : null);
  if (sort === "priceAsc" || sort === "priceDesc") {
    const direction = sort === "priceAsc" ? 1 : -1;
    // Sevas without an online price always sit after priced ones
    sorted.sort((a, b) => {
      const pa = priceOf(a);
      const pb = priceOf(b);
      if (pa === null && pb === null) return 0;
      if (pa === null) return 1;
      if (pb === null) return -1;
      return (pa - pb) * direction;
    });
  } else if (sort === "name") {
    sorted.sort((a, b) => a.name.localeCompare(b.name, lang === "kn" ? "kn" : "en"));
  } else {
    // Featured: online-bookable first, catalog order otherwise
    sorted.sort((a, b) => Number(isBookableOnline(b)) - Number(isBookableOnline(a)));
  }
  return sorted;
}

export default function SevaBooking() {
  const { t, lang } = useI18n("shop");
  const { sevas, status, retry } = useSevas(lang);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("featured");

  const counts = useMemo(
    () => ({
      all: sevas.length,
      online: sevas.filter(isBookableOnline).length,
      office: sevas.filter((seva) => !isBookableOnline(seva)).length,
    }),
    [sevas]
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = sevas.filter((seva) => {
      if (filter === "online" && !isBookableOnline(seva)) return false;
      if (filter === "office" && isBookableOnline(seva)) return false;
      if (!needle) return true;
      return `${seva.name} ${seva.description || ""}`.toLowerCase().includes(needle);
    });
    return sortSevas(filtered, sort, lang);
  }, [sevas, query, filter, sort, lang]);

  const filterLabel = { all: t("filterAll"), online: t("filterOnline"), office: t("filterOffice") };
  const sortLabel = {
    featured: t("sortFeatured"),
    priceAsc: t("sortPriceAsc"),
    priceDesc: t("sortPriceDesc"),
    name: t("sortName"),
  };
  const isFiltered = query.trim() !== "" || filter !== "all";
  const resultText = visible.length === 1 ? t("resultOne") : interpolate(t("resultMany"), { n: visible.length });

  const clearFilters = () => {
    setQuery("");
    setFilter("all");
  };

  return (
    <div className={shop.shop} lang={lang}>
      <div className={shop.container}>
        <Breadcrumbs items={[{ label: t("home"), to: `/${lang}` }, { label: t("sevas") }]} />

        <header className={`${shop.pageHeader} ${styles.header}`}>
          <h1 className={shop.pageTitle}>{t("catalogTitle")}</h1>
          <p className={shop.pageIntro}>{t("catalogIntro")}</p>
        </header>

        <div className={styles.toolbar} role="search">
          <label className={styles.search}>
            <span className={styles.srOnly}>{t("searchLabel")}</span>
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
              autoComplete="off"
            />
            {query ? (
              <button type="button" className={styles.clearSearch} onClick={() => setQuery("")} aria-label={t("clearFilters")}>
                <X size={16} aria-hidden="true" />
              </button>
            ) : null}
          </label>

          <div className={styles.filters} role="group" aria-label={t("searchLabel")}>
            {FILTERS.map((key) => (
              <button
                key={key}
                type="button"
                className={`${styles.filterChip} ${filter === key ? styles.filterChipActive : ""}`}
                aria-pressed={filter === key}
                onClick={() => setFilter(key)}
              >
                {filterLabel[key]}
                {status === "ready" ? <span className={styles.filterCount}>{counts[key]}</span> : null}
              </button>
            ))}
          </div>

          <label className={styles.sort}>
            <SlidersHorizontal size={16} aria-hidden="true" />
            <span className={styles.srOnly}>{t("sortLabel")}</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label={t("sortLabel")}>
              {SORTS.map((key) => (
                <option key={key} value={key}>
                  {sortLabel[key]}
                </option>
              ))}
            </select>
          </label>
        </div>

        {status === "ready" && sevas.length > 0 ? (
          <p className={styles.resultCount} aria-live="polite">
            {resultText}
          </p>
        ) : null}

        {status === "loading" ? (
          <div className={shop.grid} aria-busy="true">
            {Array.from({ length: 6 }, (_, index) => (
              <SevaCardSkeleton key={index} />
            ))}
          </div>
        ) : null}

        {status === "error" ? (
          <ErrorState title={t("loadErrorTitle")} body={t("loadErrorBody")} onRetry={retry} t={t} />
        ) : null}

        {status === "ready" && sevas.length === 0 ? (
          <div className={shop.stateBox}>
            <p className={shop.stateTitle}>{t("emptyTitle")}</p>
            <p className={shop.stateBody}>{t("emptyBody")}</p>
          </div>
        ) : null}

        {status === "ready" && sevas.length > 0 && visible.length === 0 ? (
          <div className={shop.stateBox}>
            <p className={shop.stateTitle}>{t("noResultsTitle")}</p>
            <p className={shop.stateBody}>{t("noResultsBody")}</p>
            {isFiltered ? (
              <div className={shop.stateActions}>
                <button type="button" className={shop.btnSecondary} onClick={clearFilters}>
                  {t("clearFilters")}
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        {status === "ready" && visible.length > 0 ? (
          <div className={shop.grid}>
            {visible.map((seva) => (
              <SevaCard key={seva.id} seva={seva} lang={lang} t={t} />
            ))}
          </div>
        ) : null}

        <div className={styles.assurance}>
          <AssuranceStrip t={t} />
        </div>
      </div>
    </div>
  );
}
