import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type ArcaneLoaderProps = {
  label?: string;
  className?: string;
};

export function ArcaneLoader({
  label = "Loading...",
  className,
}: ArcaneLoaderProps) {
  return (
    <div
      className={cn(
        "flex min-h-[60vh] w-full items-center justify-center",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="relative flex flex-col items-center gap-3 text-center">
        <div className="relative h-24 w-24 sm:h-32 sm:w-32 lg:h-36 lg:w-36">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12),transparent_65%)] blur-xl" />
          <div className="absolute inset-0 rounded-full border border-muted-foreground/20" />
          <div className="absolute inset-2 rounded-full border border-dashed border-muted-foreground/30 animate-[spin_10s_linear_infinite]" />
          <div className="absolute inset-6 rounded-full border border-muted-foreground/20 animate-[spin_6s_linear_infinite]" />
          <div className="absolute inset-0 animate-[spin_5s_linear_infinite]">
            <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-sky-400/90 shadow-[0_0_12px_rgba(56,189,248,0.6)]" />
            <span className="absolute right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-emerald-400/80 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
            <span className="absolute left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-amber-400/80 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="h-8 w-8 sm:h-9 sm:w-9 text-sky-500/80 animate-pulse" />
          </div>
        </div>
        <div className="text-sm text-muted-foreground sm:text-base">
          {label}
        </div>
      </div>
    </div>
  );
}
