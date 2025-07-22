import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function LoadingSpinner({
  size = "md",
  text,
  className,
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin", sizeMap[size])} />
      {text && <span className="text-muted-foreground text-sm">{text}</span>}
    </div>
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  children: React.ReactNode;
}

export function LoadingOverlay({
  isLoading,
  text = "Carregando...",
  children,
}: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="bg-background/80 absolute inset-0 z-50 flex items-center justify-center rounded-md backdrop-blur-sm">
          <LoadingSpinner size="lg" text={text} />
        </div>
      )}
    </div>
  );
}

interface LoadingPageProps {
  text?: string;
}

export function LoadingPage({
  text = "Carregando página...",
}: LoadingPageProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}
