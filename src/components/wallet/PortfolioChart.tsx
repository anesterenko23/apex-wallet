import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";
import { cn } from "@/lib/utils";
import { buildSeries, fmtPct, fmtUsd, ranges, type Range } from "@/lib/wallet-data";
import { useWallet } from "@/lib/wallet-store";

type Hovered = { t: number; v: number; delta: number; pct: number } | null;

export function PortfolioChart({
  endValue,
  seed = 7,
  height = 240,
  compact = false,
}: {
  endValue: number;
  seed?: number;
  height?: number;
  compact?: boolean;
}) {
  const [range, setRange] = useState<Range>("1M");
  const [hovered, setHovered] = useState<Hovered>(null);
  const { privacy } = useWallet();

  const data = useMemo(() => buildSeries(endValue, range, seed), [endValue, range, seed]);
  const first = data[0]?.v ?? endValue;
  const last = data[data.length - 1]?.v ?? endValue;
  const up = last >= first;
  const delta = last - first;
  const pct = (delta / first) * 100;

  const stroke = up ? "var(--gain)" : "var(--loss)";
  const gradientId = `pf-${seed}-${up ? "up" : "down"}`;

  const readoutValue = hovered?.v ?? last;
  const readoutDelta = hovered ? hovered.delta : delta;
  const readoutPct = hovered ? hovered.pct : pct;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div className="min-h-[38px]">
          {hovered ? (
            <>
              <div className="num text-[13px] font-medium">
                {privacy ? "••••••" : fmtUsd(readoutValue)}
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>
                  {new Date(hovered.t).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
                <span className={cn("num", readoutDelta >= 0 ? "text-gain" : "text-loss")}>
                  {readoutDelta >= 0 ? "+" : "−"}
                  {privacy ? "••••" : fmtUsd(Math.abs(readoutDelta))} ({fmtPct(readoutPct)})
                </span>
              </div>
            </>
          ) : (
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {range} performance
              <div className={cn("num mt-1 text-[13px] font-medium", up ? "text-gain" : "text-loss")}>
                {delta >= 0 ? "+" : "−"}
                {privacy ? "••••" : fmtUsd(Math.abs(delta))} ({fmtPct(pct)})
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-0.5 rounded-lg border border-border bg-surface/60 p-0.5">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "press relative rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                range === r ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {range === r && (
                <motion.span
                  layoutId={`range-${seed}`}
                  className="absolute inset-0 rounded-md bg-primary"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">{r}</span>
            </button>
          ))}
        </div>
      </div>

      <motion.div
        key={range}
        initial={{ opacity: 0.35, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ height }}
        className="-mx-1"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 4, bottom: 0, left: 4 }}
            onMouseLeave={() => setHovered(null)}
            onMouseMove={(state) => {
              const p = state?.activePayload?.[0]?.payload as { t: number; v: number } | undefined;
              if (!p) return;
              setHovered({ t: p.t, v: p.v, delta: p.v - first, pct: ((p.v - first) / first) * 100 });
            }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity={0.32} />
                <stop offset="100%" stopColor={stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="t" hide />
            <YAxis domain={["dataMin", "dataMax"]} hide />
            <Tooltip content={<CursorOnly />} cursor={{ stroke: "var(--border-strong)", strokeDasharray: "3 3" }} />
            <Area
              type="monotone"
              dataKey="v"
              stroke={stroke}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              activeDot={{ r: 3.5, fill: stroke, stroke: "var(--background)", strokeWidth: 2 }}
              animationDuration={compact ? 400 : 700}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}

function CursorOnly(_props: TooltipProps<number, string>) {
  return null;
}
