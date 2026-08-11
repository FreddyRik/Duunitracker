"use client";

export const inputClassName =
  "w-full rounded-md border border-border-strong bg-transparent px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent focus:ring-1 focus:ring-ring disabled:bg-input-disabled disabled:text-muted";

export function JobFormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-muted-strong">{label}</span>
      {children}
    </label>
  );
}
