"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DINING_HALLS } from "@/lib/dining-halls";
import { useEffect } from "react";

const pinIcon = new L.DivIcon({
  html: `<div style="font-size:28px;text-align:center;line-height:44px;width:44px;height:44px;border-radius:50%;background:#3b82f6;box-shadow:0 4px 14px rgba(59,130,246,0.45);border:3px solid white;color:white;">📍</div>`,
  className: "",
  iconSize: [44, 44],
  iconAnchor: [22, 44],
});

const diningIconSmall = new L.DivIcon({
  html: `<div style="font-size:16px;text-align:center;line-height:28px;width:28px;height:28px;border-radius:50%;background:white;box-shadow:0 1px 4px rgba(0,0,0,0.12);border:1.5px solid #e5e7eb;">🍽️</div>`,
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function ClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 16, { duration: 0.8 });
  }, [lat, lng, map]);
  return null;
}

interface LocationPickerLeafletProps {
  location: { lat: number; lng: number } | null;
  onLocationChange: (lat: number, lng: number) => void;
  className?: string;
}

export default function LocationPickerLeaflet({
  location,
  onLocationChange,
  className = "",
}: LocationPickerLeafletProps) {
  const center: [number, number] = location
    ? [location.lat, location.lng]
    : [43.0731, -89.4012];

  return (
    <div className={`overflow-hidden rounded-2xl ${className}`}>
      <MapContainer
        center={center}
        zoom={location ? 16 : 15}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ minHeight: "280px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onMapClick={onLocationChange} />
        {location && (
          <>
            <FlyTo lat={location.lat} lng={location.lng} />
            <Marker position={[location.lat, location.lng]} icon={pinIcon}>
              <Popup>
                <span className="font-semibold text-sm">Your location</span>
              </Popup>
            </Marker>
          </>
        )}
        {DINING_HALLS.map((hall) => (
          <Marker key={hall.id} position={[hall.lat, hall.lng]} icon={diningIconSmall}>
            <Popup>
              <span className="text-xs font-medium">{hall.shortName}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
