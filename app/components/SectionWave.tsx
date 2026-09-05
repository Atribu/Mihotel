import type { CSSProperties } from "react";

type WaveSurface = "paper" | "soft" | "warm" | "footer";

type SectionWaveProps = {
  from: WaveSurface;
  to: WaveSurface;
  mirrored?: boolean;
};

const surfaceColors: Record<WaveSurface, string> = {
  paper: "#fdfbf8",
  soft: "#f5f5f5",
  warm: "#f4eee7",
  footer: "#eee7df",
};

export function SectionWave({ from, to, mirrored = false }: SectionWaveProps) {
  const style = {
    "--wave-from": surfaceColors[from],
    "--wave-to": surfaceColors[to],
  } as CSSProperties;

  return (
    <div
      className={`reference-section-wave reference-section-wave--${from}-${to}${mirrored ? " reference-section-wave--mirrored" : ""}`}
      style={style}
      aria-hidden="true"
    />
  );
}
