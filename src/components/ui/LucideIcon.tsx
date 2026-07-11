"use client";

import { icons, type LucideProps } from "lucide-react";

/**
 * Renders a Lucide icon by its PascalCase name (e.g. "IceCreamBowl").
 * Falls back to `null` when the name is unknown so callers can show an emoji.
 */
export function LucideIcon({
  name,
  ...props
}: { name?: string | null } & LucideProps) {
  if (!name) return null;
  const Icon = (icons as Record<string, React.ComponentType<LucideProps>>)[name];
  if (!Icon) return null;
  return <Icon {...props} />;
}
