"use client";

import {
  VolumeX, Laptop, Backpack, Globe, Heart, BookOpen,
  Trophy, Palette, Dumbbell, Music, ChefHat, Shuffle,
  type LucideProps,
} from "lucide-react";

const iconMap: Record<string, React.FC<LucideProps>> = {
  "volume-x": VolumeX,
  laptop: Laptop,
  backpack: Backpack,
  globe: Globe,
  heart: Heart,
  "book-open": BookOpen,
  trophy: Trophy,
  palette: Palette,
  dumbbell: Dumbbell,
  music: Music,
  "chef-hat": ChefHat,
  shuffle: Shuffle,
};

export default function VibeIcon({
  name,
  className = "h-4 w-4",
}: {
  name: string;
  className?: string;
}) {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon className={className} />;
}
