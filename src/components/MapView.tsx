"use client";

import { useEffect, useState } from "react";
import { DINING_HALLS, type DiningHall, haversineDistance, walkingTimeMinutes } from "@/lib/dining-halls";
import { Footprints, MapPin } from "lucide-react";

interface MapViewProps {
  selectedHall?: string | null;
  onSelectHall?: (hall: DiningHall) => void;
  userLocation?: { lat: number; lng: number } | null;
  showResidenceHalls?: boolean;
  className?: string;
  highlightedHalls?: string[];
}

export default function MapView({
  selectedHall,
  onSelectHall,
  userLocation,
  className = "",
  highlightedHalls,
}: MapViewProps) {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<MapViewProps> | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    import("./MapViewLeaflet").then((mod) => {
      setMapComponent(() => mod.default);
      setIsLoaded(true);
    });
  }, []);

  if (!isLoaded || !MapComponent) {
    return (
      <div className={`rounded-2xl bg-stone-100 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <MapPin className="h-6 w-6 text-stone-300 mx-auto mb-1.5" />
          <p className="text-[12px] text-stone-400">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <MapComponent
      selectedHall={selectedHall}
      onSelectHall={onSelectHall}
      userLocation={userLocation}
      className={className}
      highlightedHalls={highlightedHalls}
    />
  );
}

export function DiningHallCard({
  hall, selected, onClick, userLocation,
}: {
  hall: DiningHall; selected?: boolean; onClick?: () => void;
  userLocation?: { lat: number; lng: number } | null;
}) {
  const dist = userLocation ? haversineDistance(userLocation.lat, userLocation.lng, hall.lat, hall.lng) : null;
  const wt = dist ? walkingTimeMinutes(dist) : null;

  return (
    <button onClick={onClick}
      className={`w-full text-left rounded-xl border p-3.5 transition-all duration-150 ${
        selected ? "border-stone-900 bg-stone-50 shadow-sm" : "border-stone-200 bg-white hover:border-stone-300"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <h3 className="text-[13px] font-bold text-stone-900 truncate">{hall.name}</h3>
          <p className="mt-0.5 text-[11px] text-stone-400 truncate">{hall.address}</p>
        </div>
        {wt !== null && (
          <span className="shrink-0 flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            <Footprints className="h-3 w-3" />{wt} min
          </span>
        )}
      </div>
      <p className="mt-1.5 text-[11px] text-stone-500 line-clamp-1">{hall.description}</p>
    </button>
  );
}
