import {
  Code,
  Smartphone,
  Palette,
  TrendingUp,
  Megaphone,
  Wrench,
  Layers,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  code: Code,
  smartphone: Smartphone,
  palette: Palette,
  "trending-up": TrendingUp,
  megaphone: Megaphone,
  wrench: Wrench,
};

export function serviceIcon(key: string | null): LucideIcon {
  if (!key) return Layers;
  return ICONS[key] ?? Layers;
}
