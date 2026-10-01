import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Check, ImageOff, ImageUp, LoaderCircle, RotateCcw, RotateCw, X } from "lucide-react";
import { Badge } from "./ui";
import { cx } from "./cx";
import styles from "./Console.module.css";
import own from "./ImageCropper.module.css";
import { useObjectUrl } from "./useObjectUrl";

const MAX_ZOOM = 5;
const MAX_OUTPUT_WIDTH = 2000;
const LOW_RES_WIDTH = 800;
const MIN_BOX = 64; // smallest crop box, in screen pixels
const EDGE_GAP = 6; // keep handles this far inside the stage
const CORNERS = [
  { id: "nw", dx: -1, dy: -1, label: "top left" },
  { id: "ne", dx: 1, dy: -1, label: "top right" },
  { id: "sw", dx: -1, dy: 1, label: "bottom left" },
  { id: "se", dx: 1, dy: 1, label: "bottom right" },
];
const START = { zoom: 1, u: 0.5, v: 0.5 };

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Largest frame of `ratio` that fits the stage, centred, with breathing room
// around it so the dimmed overflow of the photo stays visible.
function fitFrame(stage, ratio) {
  if (!stage.w || !stage.h) return null;
  const pad = stage.w < 480 ? 16 : 32;
  const w = Math.min(stage.w - pad * 2, (stage.h - pad * 2) * ratio);
  const h = w / ratio;
  return { w, h, x: (stage.w - w) / 2, y: (stage.h - h) / 2 };
}

// Where the photo sits relative to the frame. `u`/`v` is the point of the photo
// (0–1) under the frame centre; it is clamped so the photo always covers the frame.
function place(natural, frame, view) {
  const base = Math.max(frame.w / natural.w, frame.h / natural.h);
  const scale = base * view.zoom;
  const dw = natural.w * scale;
  const dh = natural.h * scale;
  const hu = frame.w / (2 * dw);
  const hv = frame.h / (2 * dh);
  const u = clamp(view.u, hu, 1 - hu);
  const v = clamp(view.v, hv, 1 - hv);
  return { base, scale, dw, dh, u, v, x: frame.w / 2 - u * dw, y: frame.h / 2 - v * dh };
}

/*
 * Crops a photo to one fixed aspect ratio, the way phone galleries do: there is
 * no skip, every upload is framed. Drag a corner of the crop box inward to crop
 * in, or outward over the dimmed photo to crop out; on release the box springs
 * back to full size and the photo zooms to match. The photo itself can be
 * dragged, pinched, scrolled and turned in quarter steps. The part outside the
 * box stays visible, dimmed, so you can see what is being left out.
 *
 * onApply receives { file, original, crop }; pass `crop` back as `initialCrop`
 * with the same original to reopen exactly where the last crop left off.
 */
export default function ImageCropper({ file, initialCrop, onCancel, onApply, ratio = 4 / 3, ratioLabel = "4 : 3", title = "Crop image", hint }) {
  const titleId = useId();
  const hintId = useId();
  const dialogRef = useRef(null);
  const stageRef = useRef(null);
  const pickerRef = useRef(null);

  const [current, setCurrent] = useState(file);
  const src = useObjectUrl(current);
  const [rotation, setRotation] = useState(initialCrop?.rotation || 0);
  const [display, setDisplay] = useState(null); // { key, url, w, h, source }
  const [failed, setFailed] = useState(false);
  const [stage, setStage] = useState({ w: 0, h: 0 });
  const [view, setView] = useState(() => (initialCrop ? { zoom: initialCrop.zoom, u: initialCrop.u, v: initialCrop.v } : START));
  const [moving, setMoving] = useState(false);
  const [box, setBox] = useState(null); // crop box in frame coordinates while a corner is dragged
  const [busy, setBusy] = useState(false);

  const viewRef = useRef(view);
  const pointers = useRef(new Map());
  const gesture = useRef(null);
  const wheelTimer = useRef(null);
  const resize = useRef(null);
  const cancelRef = useRef(onCancel);
  useEffect(() => {
    cancelRef.current = onCancel;
  }, [onCancel]);

  const displayKey = `${src}|${rotation}`;
  const ready = Boolean(display && display.key === displayKey);
  const frame = useMemo(() => fitFrame(stage, ratio), [stage, ratio]);
  const placed = ready && frame ? place(display, frame, view) : null;

  // Decode the photo once per file and rotation. A turned photo is redrawn into
  // a canvas so every later step works on upright pixels.
  useEffect(() => {
    if (!src) return undefined;
    let cancelled = false;
    let rotatedUrl = null;
    const image = new Image();
    image.onload = () => {
      if (cancelled) return;
      if (!rotation) {
        setDisplay({ key: displayKey, url: src, w: image.naturalWidth, h: image.naturalHeight, source: image });
        return;
      }
      const sideways = rotation % 180 !== 0;
      const canvas = document.createElement("canvas");
      canvas.width = sideways ? image.naturalHeight : image.naturalWidth;
      canvas.height = sideways ? image.naturalWidth : image.naturalHeight;
      const context = canvas.getContext("2d");
      context.translate(canvas.width / 2, canvas.height / 2);
      context.rotate((rotation * Math.PI) / 180);
      context.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
      canvas.toBlob(
        (blob) => {
          if (cancelled || !blob) return;
          rotatedUrl = URL.createObjectURL(blob);
          setDisplay({ key: displayKey, url: rotatedUrl, w: canvas.width, h: canvas.height, source: canvas });
        },
        "image/jpeg",
        0.95,
      );
    };
    image.onerror = () => !cancelled && setFailed(true);
    image.src = src;
    return () => {
      cancelled = true;
      if (rotatedUrl) URL.revokeObjectURL(rotatedUrl);
    };
  }, [src, rotation, displayKey]);

  useLayoutEffect(() => {
    const node = stageRef.current;
    if (!node) return undefined;
    const observer = new ResizeObserver(([entry]) => setStage({ w: entry.contentRect.width, h: entry.contentRect.height }));
    observer.observe(node);
    return () => observer.disconnect();
  }, [failed]);

  // Keep focus inside the dialog, close on Escape, and stop the page behind from scrolling.
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    (stageRef.current || dialogRef.current)?.focus({ preventScroll: true });
    const onKey = (event) => {
      if (event.key === "Escape" && !gesture.current) {
        event.preventDefault();
        cancelRef.current();
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll('button:not(:disabled), input:not(:disabled):not([type="file"]), [tabindex="0"]')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.({ preventScroll: true });
    };
  }, []);

  const commit = useCallback(
    (next) => {
      if (!ready || !frame) return;
      const p = place(display, frame, next);
      const settled = { zoom: next.zoom, u: p.u, v: p.v };
      viewRef.current = settled;
      setView(settled);
    },
    [ready, frame, display],
  );

  // Zoom to `nextZoom`, keeping the photo point under (ax, ay) — frame coordinates — still.
  const zoomAt = useCallback(
    (nextZoom, ax, ay, from = viewRef.current) => {
      if (!ready || !frame) return from;
      const zoom = clamp(nextZoom, 1, MAX_ZOOM);
      const p = place(display, frame, from);
      const pu = (ax - p.x) / p.dw;
      const pv = (ay - p.y) / p.dh;
      const dw = p.dw * (zoom / from.zoom);
      const dh = p.dh * (zoom / from.zoom);
      return { zoom, u: (frame.w / 2 - (ax - pu * dw)) / dw, v: (frame.h / 2 - (ay - pv * dh)) / dh };
    },
    [ready, frame, display],
  );

  const panBy = useCallback(
    (dx, dy, from = viewRef.current) => {
      if (!ready || !frame) return from;
      const p = place(display, frame, from);
      return { zoom: from.zoom, u: p.u - dx / p.dw, v: p.v - dy / p.dh };
    },
    [ready, frame, display],
  );

  const toFrame = (event) => {
    const box = stageRef.current.getBoundingClientRect();
    return { x: event.clientX - box.left - frame.x, y: event.clientY - box.top - frame.y };
  };

  const zoomCentred = (factor) => frame && commit(zoomAt(viewRef.current.zoom * factor, frame.w / 2, frame.h / 2));

  useEffect(() => {
    const node = stageRef.current;
    if (!node || !ready || !frame) return undefined;
    const onWheel = (event) => {
      event.preventDefault();
      const box = node.getBoundingClientRect();
      // Trackpad pinches arrive as ctrl+wheel with small deltas; mice send big steps.
      const factor = Math.exp(-event.deltaY * (event.ctrlKey ? 0.01 : 0.0018));
      commit(zoomAt(viewRef.current.zoom * factor, event.clientX - box.left - frame.x, event.clientY - box.top - frame.y));
      setMoving(true);
      clearTimeout(wheelTimer.current);
      wheelTimer.current = setTimeout(() => setMoving(false), 220);
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [ready, frame, commit, zoomAt]);

  useEffect(() => () => clearTimeout(wheelTimer.current), []);

  const onPointerDown = (event) => {
    if (!ready || event.button > 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    gesture.current = true;
    setMoving(true);
  };

  const onPointerMove = (event) => {
    const map = pointers.current;
    const last = map.get(event.pointerId);
    if (!last) return;
    const points = [...map.values()];
    if (points.length === 1) {
      commit(panBy(event.clientX - last.x, event.clientY - last.y));
    } else if (points.length === 2) {
      const other = points.find((point) => point !== last);
      const before = { mid: { x: (last.x + other.x) / 2, y: (last.y + other.y) / 2 }, dist: Math.hypot(last.x - other.x, last.y - other.y) };
      const after = {
        mid: { x: (event.clientX + other.x) / 2, y: (event.clientY + other.y) / 2 },
        dist: Math.hypot(event.clientX - other.x, event.clientY - other.y),
      };
      const anchor = toFrame({ clientX: before.mid.x, clientY: before.mid.y });
      const zoomed = zoomAt(viewRef.current.zoom * (after.dist / (before.dist || 1)), anchor.x, anchor.y);
      commit(panBy(after.mid.x - before.mid.x, after.mid.y - before.mid.y, zoomed));
    }
    map.set(event.pointerId, { x: event.clientX, y: event.clientY });
  };

  const onPointerUp = (event) => {
    pointers.current.delete(event.pointerId);
    if (!pointers.current.size) {
      gesture.current = null;
      setMoving(false);
    }
  };

  // Corner drag: the corner opposite the one held stays put and the box keeps
  // its ratio. It may grow past the frame over the dimmed photo (crop out) but
  // never past the photo's edges or the stage.
  const onHandleDown = (corner) => (event) => {
    if (!placed || event.button > 0) return;
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    const bounds = {
      left: Math.max(placed.x, EDGE_GAP - frame.x),
      top: Math.max(placed.y, EDGE_GAP - frame.y),
      right: Math.min(placed.x + placed.dw, stage.w - EDGE_GAP - frame.x),
      bottom: Math.min(placed.y + placed.dh, stage.h - EDGE_GAP - frame.y),
    };
    const anchor = { x: corner.dx < 0 ? frame.w : 0, y: corner.dy < 0 ? frame.h : 0 };
    const maxW = Math.min(
      corner.dx > 0 ? bounds.right - anchor.x : anchor.x - bounds.left,
      (corner.dy > 0 ? bounds.bottom - anchor.y : anchor.y - bounds.top) * ratio,
    );
    const minW = Math.min(maxW, Math.max(MIN_BOX, (frame.w * view.zoom) / MAX_ZOOM));
    resize.current = { pointerId: event.pointerId, corner, anchor, minW, maxW };
    gesture.current = true;
    setMoving(true);
    setBox({ x: 0, y: 0, w: frame.w, h: frame.h });
  };

  const onHandleMove = (event) => {
    const drag = resize.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.stopPropagation();
    const { corner, anchor } = drag;
    const point = toFrame(event);
    const rawW = corner.dx > 0 ? point.x - anchor.x : anchor.x - point.x;
    const rawH = corner.dy > 0 ? point.y - anchor.y : anchor.y - point.y;
    const w = clamp(Math.max(rawW, rawH * ratio), drag.minW, drag.maxW);
    const h = w / ratio;
    setBox({ x: corner.dx > 0 ? anchor.x : anchor.x - w, y: corner.dy > 0 ? anchor.y : anchor.y - h, w, h });
  };

  const onHandleUp = (event) => {
    const drag = resize.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.stopPropagation();
    resize.current = null;
    gesture.current = null;
    // Zoom so whatever the box held now fills the frame. The box springs back
    // and the photo grows (or shrinks) into place together.
    if (box && placed && Math.abs(box.w - frame.w) > 0.5) {
      commit({
        zoom: clamp((view.zoom * frame.w) / box.w, 1, MAX_ZOOM),
        u: (box.x + box.w / 2 - placed.x) / placed.dw,
        v: (box.y + box.h / 2 - placed.y) / placed.dh,
      });
    }
    setBox(null);
    setMoving(false);
  };

  const onDoubleClick = (event) => {
    if (!ready) return;
    const point = toFrame(event);
    commit(view.zoom > 1.5 ? zoomAt(1, point.x, point.y) : zoomAt(view.zoom * 2, point.x, point.y));
  };

  const rotate = () => {
    setRotation((current) => (current + 90) % 360);
    viewRef.current = START;
    setView(START);
  };

  const reset = () => {
    setRotation(0);
    viewRef.current = START;
    setView(START);
  };

  const apply = async () => {
    if (!placed || busy) return;
    setBusy(true);
    try {
      const sx = -placed.x / placed.scale;
      const sy = -placed.y / placed.scale;
      const sw = frame.w / placed.scale;
      const sh = frame.h / placed.scale;
      const outW = Math.round(Math.min(sw, MAX_OUTPUT_WIDTH));
      const outH = Math.round(outW / ratio);
      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const context = canvas.getContext("2d");
      context.imageSmoothingQuality = "high";
      context.drawImage(display.source, sx, sy, sw, sh, 0, 0, outW, outH);
      const keepPng = current.type === "image/png";
      const type = keepPng ? "image/png" : "image/jpeg";
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, type, 0.9));
      if (!blob) throw new Error("Could not crop this image");
      const base = current.name.replace(/\.[^.]+$/, "") || "image";
      onApply({
        file: new File([blob], `${base}-${outW}x${outH}.${keepPng ? "png" : "jpg"}`, { type, lastModified: Date.now() }),
        original: current,
        crop: { ...view, rotation },
      });
    } finally {
      setBusy(false);
    }
  };

  const onStageKey = (event) => {
    if (!ready) return;
    const step = event.shiftKey ? 48 : 12;
    const moves = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
    if (moves[event.key]) commit(panBy(...moves[event.key]));
    else if (event.key === "+" || event.key === "=") zoomCentred(1.2);
    else if (event.key === "-" || event.key === "_") zoomCentred(1 / 1.2);
    else if (event.key === "0") reset();
    else if (event.key === "r" || event.key === "R") rotate();
    else if (event.key === "Enter") apply();
    else return;
    event.preventDefault();
  };

  const choose = (event) => {
    const next = event.target.files?.[0];
    event.target.value = "";
    if (!next) return;
    setFailed(false);
    setCurrent(next);
    setRotation(0);
    viewRef.current = START;
    setView(START);
  };

  const output = placed ? Math.round(Math.min(frame.w / placed.scale, MAX_OUTPUT_WIDTH)) : 0;
  const lowRes = placed && output < LOW_RES_WIDTH;
  const pristine = view.zoom === 1 && view.u === 0.5 && view.v === 0.5 && rotation === 0;

  return (
    <div className={own.layer}>
      <div className={own.scrim} onClick={onCancel} aria-hidden="true" />
      <div className={own.dialog} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={hintId} ref={dialogRef} tabIndex={-1}>
        <header className={own.head}>
          <div className={own.headText}>
            <h2 id={titleId} className={own.title}>
              {title}
            </h2>
            <p id={hintId} className={own.sub}>
              {hint || `Every image is cropped to ${ratioLabel}. Move and zoom the photo until the frame holds what matters.`}
            </p>
          </div>
          <button type="button" className={styles.iconButton} onClick={onCancel} aria-label="Close without cropping">
            <X size={16} aria-hidden="true" />
          </button>
        </header>

        <div className={own.body}>
          {failed ? (
            <div className={own.failed}>
              <span className={own.failedIcon}>
                <ImageOff size={18} aria-hidden="true" />
              </span>
              <strong>This file can’t be opened</strong>
              <span>Choose a JPG, PNG or WebP photo. iPhone HEIC photos need converting to JPG first.</span>
              <button type="button" className={cx(styles.btn, styles.btnSecondary)} onClick={() => pickerRef.current?.click()}>
                <ImageUp size={15} aria-hidden="true" />
                Choose another photo
              </button>
            </div>
          ) : (
            <div
              ref={stageRef}
              className={cx(own.stage, moving && own.stageMoving)}
              tabIndex={0}
              role="application"
              aria-roledescription="Crop area"
              aria-label={`Crop area, ${ratioLabel}. Arrow keys move the photo, plus and minus crop in and out, R turns it, Enter applies.`}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onDoubleClick={onDoubleClick}
              onKeyDown={onStageKey}
            >
              {ready && placed ? (
                <img
                  src={display.url}
                  alt=""
                  draggable={false}
                  className={own.image}
                  style={{
                    width: display.w * placed.base,
                    height: display.h * placed.base,
                    transform: `translate3d(${frame.x + placed.x}px, ${frame.y + placed.y}px, 0) scale(${view.zoom})`,
                  }}
                />
              ) : (
                <LoaderCircle size={22} className={cx(styles.spin, own.loading)} aria-hidden="true" />
              )}
              {frame ? (
                <span
                  className={cx(own.window, box && own.windowResizing)}
                  style={{
                    width: (box || frame).w,
                    height: (box || frame).h,
                    transform: `translate3d(${frame.x + (box?.x || 0)}px, ${frame.y + (box?.y || 0)}px, 0)`,
                  }}
                >
                  <span className={own.thirds} aria-hidden="true" />
                  <span className={own.ratioTag} aria-hidden="true">
                    {ratioLabel}
                  </span>
                  {placed
                    ? CORNERS.map((corner) => (
                        <span
                          key={corner.id}
                          className={cx(own.handle, own[corner.id])}
                          aria-hidden="true"
                          title={`Drag the ${corner.label} corner to crop in or out`}
                          onPointerDown={onHandleDown(corner)}
                          onPointerMove={onHandleMove}
                          onPointerUp={onHandleUp}
                          onPointerCancel={onHandleUp}
                          onDoubleClick={(event) => event.stopPropagation()}
                        />
                      ))
                    : null}
                </span>
              ) : null}
            </div>
          )}

          <input ref={pickerRef} type="file" accept="image/*" hidden onChange={choose} />

          {!failed ? (
            <>
              <div className={own.controls}>
                <button type="button" className={cx(styles.btn, styles.btnSecondary, styles.btnSm)} onClick={rotate} disabled={!ready}>
                  <RotateCw size={14} aria-hidden="true" />
                  Rotate
                </button>
                <button type="button" className={cx(styles.btn, styles.btnGhost, styles.btnSm)} onClick={reset} disabled={!ready || pristine}>
                  <RotateCcw size={14} aria-hidden="true" />
                  Reset
                </button>
                {placed ? (
                  <span className={own.output}>
                    {lowRes ? <Badge tone="warning">Low resolution</Badge> : null}
                    <span title={lowRes ? "This crop may look soft on large screens. Crop out a little or use a larger photo." : undefined}>
                      {output} × {Math.round(output / ratio)} px
                    </span>
                  </span>
                ) : null}
              </div>

              <p className={own.meta}>
                <span className={own.fine}>Drag a corner in to crop in, or out to crop out. Drag the photo to move it; scroll to zoom.</span>
                <span className={own.coarse}>Drag a corner in to crop in, or out to crop out. Drag or pinch the photo to move and zoom it.</span>
              </p>
            </>
          ) : null}
        </div>

        <footer className={own.foot}>
          {!failed ? (
            <button type="button" className={cx(styles.btn, styles.btnGhost, own.another)} onClick={() => pickerRef.current?.click()}>
              <ImageUp size={15} aria-hidden="true" />
              Choose another photo
            </button>
          ) : null}
          <div className={own.footActions}>
            <button type="button" className={cx(styles.btn, styles.btnSecondary)} onClick={onCancel}>
              Cancel
            </button>
            <button type="button" className={cx(styles.btn, styles.btnPrimary)} onClick={apply} disabled={!placed || busy}>
              {busy ? <LoaderCircle size={15} className={styles.spin} aria-hidden="true" /> : <Check size={15} aria-hidden="true" />}
              {busy ? "Cropping…" : "Apply crop"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
