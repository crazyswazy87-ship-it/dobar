import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { LiquidGlass } from '../glass';
import { formatDate, formatNumber } from '../../lib/format';

export interface ChartPoint {
  /** epoch ms */
  t: number;
  v: number;
}

interface AreaChartProps {
  points: ChartPoint[];
  /** Spoken summary for screen readers. */
  ariaLabel: string;
  valueLabel?: string;
  sample?: boolean;
  height?: number;
}

const PAD = { l: 48, r: 14, t: 14, b: 28 };

function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

/**
 * Dependency-free responsive SVG area chart.
 * Pointer + keyboard (←/→/Home/End) scrubbing, glass tooltip, reduced-motion aware.
 * The plot area itself has no glass on it, so the data stays crisp.
 */
export function AreaChart({ points, ariaLabel, valueLabel = 'Followers', sample, height = 280 }: AreaChartProps) {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [active, setActive] = useState<number | null>(null);
  const gid = useId();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(240, Math.floor(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const geo = useMemo(() => {
    const innerW = width - PAD.l - PAD.r;
    const innerH = height - PAD.t - PAD.b;
    const ts = points.map((p) => p.t);
    const vs = points.map((p) => p.v);
    const tMin = Math.min(...ts);
    const tMax = Math.max(...ts);
    let vMin = Math.min(...vs);
    let vMax = Math.max(...vs);
    if (vMin === vMax) {
      vMin -= 1;
      vMax += 1;
    }
    const pad = (vMax - vMin) * 0.12;
    vMin = Math.max(0, vMin - pad);
    vMax += pad;
    const x = (t: number) => PAD.l + (tMax === tMin ? innerW / 2 : ((t - tMin) / (tMax - tMin)) * innerW);
    const y = (v: number) => PAD.t + innerH - ((v - vMin) / (vMax - vMin)) * innerH;
    const xy = points.map((p) => [x(p.t), y(p.v)] as [number, number]);
    const line = smoothPath(xy);
    const area = line
      ? `${line}L${xy[xy.length - 1][0]},${PAD.t + innerH}L${xy[0][0]},${PAD.t + innerH}Z`
      : '';
    const ticks = Array.from({ length: 4 }, (_, i) => {
      const v = vMin + ((vMax - vMin) * i) / 3;
      return { v, y: y(v) };
    });
    return { xy, line, area, ticks, baseY: PAD.t + innerH, tMin, tMax };
  }, [points, width, height]);

  const pick = (clientX: number) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = clientX - rect.left;
    let best = 0;
    let dist = Infinity;
    geo.xy.forEach(([x], i) => {
      const d = Math.abs(x - px);
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    setActive(best);
  };

  const onKey = (e: KeyboardEvent) => {
    const last = points.length - 1;
    if (e.key === 'ArrowRight') setActive((a) => Math.min(last, (a ?? -1) + 1));
    else if (e.key === 'ArrowLeft') setActive((a) => Math.max(0, (a ?? 1) - 1));
    else if (e.key === 'Home') setActive(0);
    else if (e.key === 'End') setActive(last);
    else if (e.key === 'Escape') setActive(null);
    else return;
    e.preventDefault();
  };

  const cur = active !== null ? points[active] : null;
  const curXY = active !== null ? geo.xy[active] : null;
  const delta = cur ? cur.v - points[0].v : 0;

  const xLabels = [0, Math.floor((points.length - 1) / 2), points.length - 1].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <div
      ref={wrapRef}
      className="relative select-none rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-text)]"
      style={{ height, touchAction: 'pan-y' }}
      tabIndex={0}
      role="group"
      aria-label={`${ariaLabel}. Use the left and right arrow keys to read values.`}
      onKeyDown={onKey}
      onBlur={() => setActive(null)}
      onPointerMove={(e: PointerEvent) => pick(e.clientX)}
      onPointerDown={(e: PointerEvent) => pick(e.clientX)}
      onPointerLeave={() => setActive(null)}
    >
      <svg width={width} height={height} aria-hidden="true" className="block">
        <defs>
          <linearGradient id={`${gid}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-line)" stopOpacity="0.38" />
            <stop offset="100%" stopColor="var(--chart-line)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {geo.ticks.map((t) => (
          <g key={t.y}>
            <line x1={PAD.l} x2={width - PAD.r} y1={t.y} y2={t.y} stroke="var(--chart-grid)" strokeDasharray="3 5" />
            <text x={PAD.l - 8} y={t.y + 4} textAnchor="end" fontSize="11" fill="var(--ink-muted)">
              {formatNumber(Math.round(t.v))}
            </text>
          </g>
        ))}

        {xLabels.map((i, k) => (
          <text
            key={i}
            x={geo.xy[i][0]}
            y={height - 8}
            fontSize="11"
            fill="var(--ink-muted)"
            textAnchor={k === 0 ? 'start' : k === xLabels.length - 1 ? 'end' : 'middle'}
          >
            {new Date(points[i].t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </text>
        ))}

        {geo.line && (
          <>
            <motion.path
              d={geo.area}
              fill={`url(#${gid}-fill)`}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
            />
            <motion.path
              d={geo.line}
              fill="none"
              stroke="var(--chart-line)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </>
        )}

        {points.length === 1 && <circle cx={geo.xy[0][0]} cy={geo.xy[0][1]} r="5" fill="var(--chart-line)" />}

        {curXY && (
          <g>
            <line x1={curXY[0]} x2={curXY[0]} y1={PAD.t} y2={geo.baseY} stroke="var(--ink-faint)" strokeDasharray="2 4" />
            <circle cx={curXY[0]} cy={curXY[1]} r="6" fill="var(--page-bg)" stroke="var(--chart-line)" strokeWidth="3" />
          </g>
        )}
      </svg>

      {cur && curXY && (
        <LiquidGlass
          variant="strong"
          radius={14}
          className="pointer-events-none absolute z-10 w-max px-3 py-2 text-xs"
          style={{
            left: Math.min(Math.max(curXY[0], 70), width - 70),
            top: Math.max(0, curXY[1] - 76),
            transform: 'translateX(-50%)',
          }}
        >
          <p className="muted font-semibold">{formatDate(new Date(cur.t).toISOString())}</p>
          <p className="text-sm font-bold tabular-nums">
            {formatNumber(cur.v)} <span className="muted font-medium">{valueLabel.toLowerCase()}</span>
          </p>
          {active !== 0 && (
            <p className="tabular-nums" style={{ color: delta >= 0 ? 'var(--accent-text)' : 'var(--danger-text)' }}>
              {delta >= 0 ? '+' : ''}
              {formatNumber(delta)} since start
            </p>
          )}
        </LiquidGlass>
      )}

      {sample && (
        <span className="g-chip absolute right-2 top-2" data-tone="warn">
          Sample data
        </span>
      )}

      <p className="sr-only" aria-live="polite">
        {cur ? `${formatDate(new Date(cur.t).toISOString())}: ${formatNumber(cur.v)} ${valueLabel.toLowerCase()}` : ''}
      </p>
    </div>
  );
}
