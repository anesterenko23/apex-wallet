import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { fmtPct, fmtUsd } from "@/lib/wallet-data";
import { useWallet } from "@/lib/wallet-store";

export function Panel({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("panel", className)} {...rest}>
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
        {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

export function Change({
  value,
  className,
  showIcon = false,
}: {
  value: number;
  className?: string;
  showIcon?: boolean;
}) {
  const up = value >= 0;
  return (
    <span className={cn("num font-medium", up ? "text-gain" : "text-loss", className)}>
      {showIcon && <span className="mr-0.5">{up ? "▲" : "▼"}</span>}
      {fmtPct(value)}
    </span>
  );
}

/** Privacy-aware fiat value. */
export function Fiat({
  value,
  className,
  mask = true,
}: {
  value: number;
  className?: string;
  mask?: boolean;
}) {
  const { privacy } = useWallet();
  if (privacy && mask) return <span className={cn("num", className)}>••••••</span>;
  return <span className={cn("num", className)}>{fmtUsd(value)}</span>;
}

/** Large balance readout that smoothly animates between values. */
export function AnimatedBalance({ value, className }: { value: number; className?: string }) {
  const { privacy } = useWallet();
  const mv = useMotionValue(value);
  const spring = useSpring(mv, { stiffness: 90, damping: 20, mass: 0.6 });
  const text = useTransform(spring, (v) => fmtUsd(v));

  useEffect(() => {
    mv.set(value);
  }, [value, mv]);

  if (privacy) return <span className={cn("num", className)}>••••••••</span>;
  return <motion.span className={cn("num", className)}>{text}</motion.span>;
}

export function CopyButton({
  value,
  label = "Address copied",
  className,
  children,
}: {
  value: string;
  label?: string;
  className?: string;
  children?: ReactNode;
}) {
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => timer.current && clearTimeout(timer.current), []);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
        } catch {
          /* clipboard unavailable */
        }
        setDone(true);
        toast.success(label, { description: value.length > 24 ? `${value.slice(0, 14)}…${value.slice(-6)}` : value });
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setDone(false), 1600);
      }}
      className={cn(
        "press inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground",
        className,
      )}
    >
      {done ? <Check className="size-3.5 text-gain" /> : <Copy className="size-3.5" />}
      {children}
    </button>
  );
}

export function StatusPill({ status }: { status: "confirmed" | "pending" | "failed" }) {
  const map = {
    confirmed: "text-gain border-gain/25 bg-gain/10",
    pending: "text-warning border-warning/25 bg-warning/10",
    failed: "text-loss border-loss/25 bg-loss/10",
  } as const;
  const label = { confirmed: "Confirmed", pending: "Pending", failed: "Failed" }[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium", map[status])}>
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function Row({
  label,
  value,
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-6 py-2.5 text-sm", className)}>
      <span className="text-muted-foreground">{label}</span>
      <span className="num max-w-[62%] text-right font-medium">{value}</span>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/** Purely decorative deterministic QR-style matrix for the receive flow. */
export function QrMatrix({ value, size = 190 }: { value: string; size?: number }) {
  const cells = 25;
  const seed = value.split("").reduce((n, c) => n * 31 + c.charCodeAt(0), 7) >>> 0;
  const on = (x: number, y: number) => {
    const h = (x * 374761393 + y * 668265263 + seed) >>> 0;
    return (((h ^ (h >>> 13)) * 1274126177) >>> 0) % 100 > 52;
  };
  const finder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x > cells - 8 && y < 7) || (x < 7 && y > cells - 8);

  const squares: ReactNode[] = [];
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      if (finder(x, y)) continue;
      if (!on(x, y)) continue;
      squares.push(
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} rx={0.28} fill="currentColor" />,
      );
    }
  }
  const eye = (ox: number, oy: number) => (
    <g key={`e${ox}-${oy}`}>
      <rect x={ox} y={oy} width={7} height={7} rx={1.6} fill="none" stroke="currentColor" strokeWidth={1} />
      <rect x={ox + 2} y={oy + 2} width={3} height={3} rx={0.8} fill="currentColor" />
    </g>
  );

  return (
    <div className="rounded-xl bg-foreground p-3" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${cells} ${cells}`} className="h-full w-full text-background" aria-label="Wallet address QR code">
        {squares}
        {eye(0, 0)}
        {eye(cells - 7, 0)}
        {eye(0, cells - 7)}
      </svg>
    </div>
  );
}
