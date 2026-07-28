"use client";

import { DashboardView } from "@/components/DashboardView";
import { useDashboardState } from "@/hooks/useDashboardState";

export function Dashboard() {
  const state = useDashboardState();
  return <DashboardView {...state} />;
}
