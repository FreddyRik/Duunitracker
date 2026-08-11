export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded border border-border px-1 font-mono text-[10px] leading-none text-muted">
      {children}
    </kbd>
  );
}
