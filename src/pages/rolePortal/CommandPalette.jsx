import { useEffect, useMemo, useRef, useState } from "react";
import { CornerDownLeft, Search } from "lucide-react";
import { cx } from "./cx";
import styles from "./Console.module.css";

function matches(item, query) {
  if (!query) return true;
  const haystack = `${item.label} ${item.keywords || ""}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

export default function CommandPalette({ onClose, commands }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const filtered = useMemo(() => commands.filter((item) => matches(item, query)).slice(0, 40), [commands, query]);

  useEffect(() => {
    const previous = document.activeElement;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      cancelAnimationFrame(frame);
      previous?.focus?.();
    };
  }, []);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const run = (item) => {
    if (!item) return;
    onClose();
    item.run();
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (filtered.length ? (index + 1) % filtered.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (filtered.length ? (index - 1 + filtered.length) % filtered.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      run(filtered[activeIndex]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "Tab") {
      event.preventDefault();
    }
  };

  let lastGroup = null;

  return (
    <div className={styles.paletteScrim} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className={styles.palette} role="dialog" aria-modal="true" aria-label="Command menu" onKeyDown={handleKeyDown}>
        <div className={styles.paletteSearch}>
          <Search size={17} aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            placeholder="Search pages, sevas and actions…"
            role="combobox"
            aria-expanded="true"
            aria-controls="console-command-list"
            aria-activedescendant={filtered[activeIndex] ? `cmd-${filtered[activeIndex].id}` : undefined}
            aria-autocomplete="list"
          />
          <span className={styles.kbd}>Esc</span>
        </div>
        <div className={styles.paletteList} id="console-command-list" role="listbox" ref={listRef}>
          {filtered.length ? (
            filtered.map((item, index) => {
              const Icon = item.icon;
              const showGroup = item.group !== lastGroup;
              lastGroup = item.group;
              return (
                <div key={item.id}>
                  {showGroup ? <div className={styles.paletteGroup}>{item.group}</div> : null}
                  <button
                    type="button"
                    id={`cmd-${item.id}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    data-index={index}
                    tabIndex={-1}
                    className={cx(styles.paletteItem, index === activeIndex && styles.paletteItemActive)}
                    onMouseMove={() => index !== activeIndex && setActiveIndex(index)}
                    onClick={() => run(item)}
                  >
                    {Icon ? <Icon size={16} aria-hidden="true" /> : null}
                    <span className={styles.paletteItemText}>{item.label}</span>
                    {item.hint ? <span className={styles.paletteItemHint}>{item.hint}</span> : null}
                  </button>
                </div>
              );
            })
          ) : (
            <div className={styles.paletteEmpty}>Nothing matches “{query}”.</div>
          )}
        </div>
        <div className={styles.paletteFoot}>
          <span>
            <span className={styles.kbd}>↑</span>
            <span className={styles.kbd}>↓</span>
            to move
          </span>
          <span>
            <span className={styles.kbd}>
              <CornerDownLeft size={11} aria-hidden="true" />
            </span>
            to open
          </span>
        </div>
      </div>
    </div>
  );
}
