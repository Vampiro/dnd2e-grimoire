import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type MobileDialogProps = {
  open: boolean;
  onOpenChange(open: boolean): void;
  children: React.ReactNode;
  className?: string;
};

export function MobileDialog({
  open,
  onOpenChange,
  children,
  className,
}: MobileDialogProps) {
  const [viewportSize, setViewportSize] = useState<{
    height: number;
    width: number;
  } | null>(null);

  useEffect(() => {
    const computeSize = () => {
      if (typeof window === "undefined") return;

      const vv = window.visualViewport;
      const height = vv?.height ?? window.innerHeight;
      const width = vv?.width ?? window.innerWidth;
      setViewportSize({ height, width });
    };

    computeSize();

    const vv = typeof window !== "undefined" ? window.visualViewport : null;
    vv?.addEventListener("resize", computeSize);
    window.addEventListener("resize", computeSize);

    return () => {
      vv?.removeEventListener("resize", computeSize);
      window.removeEventListener("resize", computeSize);
    };
  }, []);

  const sizeStyle = viewportSize
    ? {
        height: `${viewportSize.height}px`,
        maxHeight: `${viewportSize.height}px`,
        width: `${viewportSize.width}px`,
        maxWidth: `${viewportSize.width}px`,
      }
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "p-0",
          "h-[100dvh] max-h-[100dvh] w-full",
          "rounded-none",
          "animate-none", // 🚫 critical
          className
        )}
        style={sizeStyle}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}
