import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { networkMap, type Asset, type ChainId } from "@/lib/wallet-data";

const glyphPaths: Record<Asset["glyph"], ReactNode> = {
  eth: glyphEth(),
  sol: glyphSol(),
  btc: glyphBtc(),
  usdc: glyphUsdc(),
  generic: null,
};

function glyphEth() {
  return (
    <>
      <path d="M12 3 6.5 12.2 12 15.4l5.5-3.2L12 3Z" fill="currentColor" opacity="0.95" />
      <path d="M12 16.7 6.5 13.5 12 21l5.5-7.5-5.5 3.2Z" fill="currentColor" opacity="0.6" />
    </>
  );
}
function glyphSol() {
  return (
    <>
      <path d="M6 7.6h11.2L15 5H8.2L6 7.6Z" fill="currentColor" />
      <path d="M6 13.1h11.2L15 10.6H8.2L6 13.1Z" fill="currentColor" opacity="0.8" />
      <path d="M6 18.7h11.2L15 16.1H8.2L6 18.7Z" fill="currentColor" opacity="0.6" />
    </>
  );
}
function glyphBtc() {
  return (
    <text x="12" y="17" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">
      ₿
    </text>
  );
}
function glyphUsdc() {
  return (
    <>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" fill="none" opacity="0.7" />
      <text x="12" y="16.4" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="currentColor">
        $
      </text>
    </>
  );
}

export function TokenIcon({
  asset,
  size = 36,
  showChain = true,
  className,
}: {
  asset: Asset;
  size?: number;
  showChain?: boolean;
  className?: string;
}) {
  const glyph = glyphPaths[asset.glyph];
  return (
    <span className={cn("relative inline-flex shrink-0", className)} style={{ width: size, height: size }}>
      <span
        className="flex h-full w-full items-center justify-center rounded-full border border-border-strong"
        style={{
          background: `radial-gradient(120% 120% at 30% 0%, color-mix(in oklab, ${asset.color} 55%, transparent), color-mix(in oklab, ${asset.color} 12%, transparent))`,
          color: asset.color,
        }}
      >
        {glyph ? (
          <svg viewBox="0 0 24 24" width={size * 0.66} height={size * 0.66} aria-hidden>
            {glyph}
          </svg>
        ) : (
          <span
            className="font-semibold leading-none"
            style={{ fontSize: size * 0.36, color: asset.color }}
          >
            {asset.symbol.slice(0, 2)}
          </span>
        )}
      </span>
      {showChain && (
        <span
          className="absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-background"
          style={{
            width: size * 0.36,
            height: size * 0.36,
            background: networkMap[asset.chain].color,
          }}
        />
      )}
    </span>
  );
}

export function ChainDot({ chain, size = 14 }: { chain: ChainId; size?: number }) {
  const net = networkMap[chain];
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-background"
      style={{ width: size, height: size, background: net.color }}
      title={net.name}
      aria-label={net.name}
    >
      {net.short.slice(0, 1)}
    </span>
  );
}

/** Deterministic identity avatar generated from an address. */
export function AccountAvatar({
  address,
  hue,
  size = 36,
  className,
}: {
  address: string;
  hue: number;
  size?: number;
  className?: string;
}) {
  const seed = address.split("").reduce((n, c) => n + c.charCodeAt(0), 0);
  const angle = seed % 360;
  return (
    <span
      className={cn("relative inline-block shrink-0 overflow-hidden rounded-full border border-border-strong", className)}
      style={{
        width: size,
        height: size,
        background: `conic-gradient(from ${angle}deg, oklch(0.72 0.15 ${hue}), oklch(0.42 0.09 ${(hue + 120) % 360}), oklch(0.62 0.13 ${(hue + 250) % 360}), oklch(0.72 0.15 ${hue}))`,
      }}
    >
      <span
        className="absolute inset-0"
        style={{
          background: `radial-gradient(60% 60% at ${30 + (seed % 40)}% ${20 + (seed % 55)}%, oklch(1 0 0 / 35%), transparent 70%)`,
        }}
      />
    </span>
  );
}

export function AppAvatar({ name, hue, size = 40 }: { name: string; hue: number; size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-lg border border-border-strong font-semibold"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: `linear-gradient(150deg, oklch(0.5 0.12 ${hue} / 45%), oklch(0.3 0.06 ${hue} / 30%))`,
        color: `oklch(0.9 0.08 ${hue})`,
      }}
    >
      {name.slice(0, 1)}
    </span>
  );
}
