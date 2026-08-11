export function Tag({
  children,
  tone = "neutral",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "outline";
  className?: string;
}) {
  const toneClass =
    tone === "outline"
      ? "border border-border text-muted-strong"
      : "bg-surface-muted text-muted-strong";

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium ${toneClass} ${className}`}
    >
      {children}
    </span>
  );
}
