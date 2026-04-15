"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DINING_HALLS, type DiningHall } from "@/lib/dining-halls";
import { useEffect } from "react";

const diningIcon = new L.DivIcon({
  html: `<div style="font-size:24px;text-align:center;line-height:36px;width:36px;height:36px;border-radius:50%;background:white;box-shadow:0 2px 8px rgba(0,0,0,0.15);border:2px solid #c41414;">🍽️</div>`,
  className: "",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const selectedDiningIcon = new L.DivIcon({
  html: `<div style="font-size:28px;text-align:center;line-height:44px;width:44px;height:44px;border-radius:50%;background:#c41414;box-shadow:0 4px 12px rgba(196,20,20,0.4);border:3px solid white;color:white;">🍽️</div>`,
  className: "",
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

const userIcon = new L.DivIcon({
  html: `<div style="font-size:20px;text-align:center;line-height:32px;width:32px;height:32px;border-radius:50%;background:#3b82f6;box-shadow:0 2px 8px rgba(59,130,246,0.4);border:2px solid white;">📍</div>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 15, { duration: 1 });
  }, [lat, lng, map]);
  return null;
}

interface MapViewLeafletProps {
  selectedHall?: string | null;
  onSelectHall?: (hall: DiningHall) => void;
  userLocation?: { lat: number; lng: number } | null;
  className?: string;
  highlightedHalls?: string[];
}

export default function MapViewLeaflet({
  selectedHall,
  onSelectHall,
  userLocation,
  className = "",
}: MapViewLeafletProps) {
  const center: [number, number] = [43.0731, -89.4012];
  const selected = DINING_HALLS.find((h) => h.id === selectedHall);

  return (
    <div className={`overflow-hidden rounded-3xl ${className}`}>
      <MapContainer
        center={selected ? [selected.lat, selected.lng] : center}
        zoom={15}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ minHeight: "300px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {selected && <FlyTo lat={selected.lat} lng={selected.lng} />}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <span className="font-semibold">You are here</span>
            </Popup>
          </Marker>
        )}
        {DINING_HALLS.map((hall) => (
          <Marker
            key={hall.id}
            position={[hall.lat, hall.lng]}
            icon={selectedHall === hall.id ? selectedDiningIcon : diningIcon}
            eventHandlers={{
              click: () => onSelectHall?.(hall),
            }}
          >
            <Popup>
              <div className="text-center">
                <strong className="text-sm">{hall.name}</strong>
                <br />
                <span className="text-xs text-gray-500">{hall.hours}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
