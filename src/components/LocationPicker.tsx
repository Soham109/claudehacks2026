"use client";

import { useEffect, useState, useCallback } from "react";
import { RESIDENCE_HALLS, DINING_HALLS, haversineDistance, walkingTimeMinutes } from "@/lib/dining-halls";
import { Home, MapPin, Navigation, Search, Check, Building, Trees, Footprints } from "lucide-react";

interface LocationPickerProps {
  location: { lat: number; lng: number } | null;
  onLocationChange: (lat: number, lng: number) => void;
  residenceHall: string;
  onResidenceChange: (id: string) => void;
  addressLabel: string;
  onAddressChange: (label: string) => void;
}

export default function LocationPicker({
  location, onLocationChange, residenceHall, onResidenceChange, addressLabel, onAddressChange,
}: LocationPickerProps) {
  const [MapComp, setMapComp] = useState<React.ComponentType<{
    location: { lat: number; lng: number } | null;
    onLocationChange: (lat: number, lng: number) => void;
    className?: string;
  }> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{ display_name: string; lat: string; lon: string }[]>([]);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [mode, setMode] = useState<"quick" | "map">(location ? "map" : "quick");

  useEffect(() => {
    import("./LocationPickerLeaflet").then((mod) => setMapComp(() => mod.default));
  }, []);

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { "User-Agent": "ConnecTable/1.0" } }
      );
      const data = await res.json();
      if (data.display_name) {
        const short = [data.address?.road, data.address?.house_number, data.address?.neighbourhood || data.address?.suburb].filter(Boolean).join(" ");
        onAddressChange(short || data.display_name.split(",").slice(0, 2).join(","));
      }
    } catch { /* silent */ }
  }, [onAddressChange]);

  function handleMapClick(lat: number, lng: number) {
    onLocationChange(lat, lng); onResidenceChange("custom"); reverseGeocode(lat, lng);
  }

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    setSearching(true); setSearchResults([]);
    try {
      const q = searchQuery.includes("Madison") ? searchQuery : `${searchQuery}, Madison, WI`;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&viewbox=-89.5,-89.35,43.02,43.12&bounded=1`,
        { headers: { "User-Agent": "ConnecTable/1.0" } }
      );
      setSearchResults(await res.json());
    } catch { /* */ } finally { setSearching(false); }
  }

  function handleSearchSelect(r: { display_name: string; lat: string; lon: string }) {
    onLocationChange(parseFloat(r.lat), parseFloat(r.lon));
    onResidenceChange("custom");
    onAddressChange(r.display_name.split(",").slice(0, 2).join(",").trim());
    setSearchResults([]); setSearchQuery(""); setMode("map");
  }

  function handleResidenceSelect(hallId: string) {
    const h = RESIDENCE_HALLS.find((r) => r.id === hallId);
    if (h) { onResidenceChange(hallId); onLocationChange(h.lat, h.lng); onAddressChange(h.name); setMode("map"); }
  }

  function handleGPS() {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocationChange(pos.coords.latitude, pos.coords.longitude);
        onResidenceChange("custom"); reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        setMode("map"); setGpsLoading(false);
      },
      () => setGpsLoading(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const nearestHalls = location
    ? DINING_HALLS.map((dh) => ({ ...dh, dist: haversineDistance(location.lat, location.lng, dh.lat, dh.lng) }))
        .sort((a, b) => a.dist - b.dist).slice(0, 3)
    : [];

  return (
    <div className="space-y-3">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <button onClick={() => setMode("quick")}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[12px] font-medium transition-all ${
            mode === "quick" ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 text-stone-500 hover:border-stone-300"
          }`}>
          <Home className="h-3.5 w-3.5" />Pick Dorm
        </button>
        <button onClick={() => setMode("map")}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[12px] font-medium transition-all ${
            mode === "map" ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 text-stone-500 hover:border-stone-300"
          }`}>
          <MapPin className="h-3.5 w-3.5" />Pin on Map
        </button>
      </div>

      {mode === "quick" ? (
        <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto rounded-xl border border-stone-200 p-2 sm:grid-cols-2">
          {RESIDENCE_HALLS.map((h) => (
            <button key={h.id} onClick={() => handleResidenceSelect(h.id)}
              className={`flex items-center gap-2.5 rounded-lg border p-2.5 text-left transition-all ${
                residenceHall === h.id ? "border-stone-900 bg-stone-50" : "border-transparent hover:bg-stone-50"
              }`}>
              {h.area === "Southeast" ? <Building className="h-4 w-4 text-stone-400 shrink-0" /> :
               h.area === "Lakeshore" ? <Trees className="h-4 w-4 text-stone-400 shrink-0" /> :
               <Home className="h-4 w-4 text-stone-400 shrink-0" />}
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-stone-800 truncate">{h.name}</p>
                <p className="text-[10px] text-stone-400">{h.area}</p>
              </div>
              {residenceHall === h.id && <Check className="h-3.5 w-3.5 text-stone-900 ml-auto shrink-0" />}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-2.5">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search address or building..."
                className="input-field pl-8 pr-16 text-[12px]" />
              <button onClick={handleSearch} disabled={searching}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md bg-stone-100 px-2 py-1 text-[10px] font-semibold text-stone-600 hover:bg-stone-200 transition-colors">
                {searching ? "..." : "Search"}
              </button>
            </div>
            <button onClick={handleGPS} disabled={gpsLoading}
              className="shrink-0 flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-[11px] font-semibold text-blue-700 hover:bg-blue-100 transition-colors disabled:opacity-50">
              {gpsLoading ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
                : <Navigation className="h-3.5 w-3.5" />}
              GPS
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="rounded-xl border border-stone-200 bg-white shadow-lg overflow-hidden">
              {searchResults.map((r, i) => (
                <button key={i} onClick={() => handleSearchSelect(r)}
                  className="w-full text-left px-3.5 py-2.5 text-[12px] text-stone-700 hover:bg-stone-50 border-b border-stone-50 last:border-0 transition-colors">
                  <span className="font-medium">{r.display_name.split(",")[0]}</span>
                  <span className="text-stone-400 text-[10px] block mt-0.5">{r.display_name.split(",").slice(1, 3).join(",")}</span>
                </button>
              ))}
            </div>
          )}

          {MapComp ? (
            <MapComp location={location} onLocationChange={handleMapClick} className="h-[260px]" />
          ) : (
            <div className="h-[260px] rounded-2xl bg-stone-100 flex items-center justify-center">
              <MapPin className="h-6 w-6 text-stone-300" />
            </div>
          )}
          <p className="text-[10px] text-stone-400 text-center">Click the map to pin your location, or use search / GPS</p>
        </div>
      )}

      {location && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5">
          <div className="flex items-start gap-2.5">
            <MapPin className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-emerald-900">{addressLabel || "Location set"}</p>
              <p className="text-[10px] text-emerald-600 mt-0.5 tabular-nums">{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>
              {nearestHalls.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {nearestHalls.map((dh) => (
                    <span key={dh.id} className="inline-flex items-center gap-1 rounded-md bg-white/80 border border-emerald-200 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                      <Footprints className="h-3 w-3" />{dh.shortName} — {walkingTimeMinutes(dh.dist)} min
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
