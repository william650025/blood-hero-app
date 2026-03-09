'use client';

import { useSyncExternalStore } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { BloodStationRow } from '@/lib/actions/stations';
import { MapPin, Phone, Clock } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue with Next.js
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

// SSR-safe mount detection without useEffect + setState
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

interface MapViewProps {
  stations: BloodStationRow[];
}

export function MapView({ stations }: MapViewProps) {
  const isMounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!isMounted) {
    return (
      <div className="flex h-full items-center justify-center bg-neutral-100">
        <p className="text-muted-foreground">載入地圖中...</p>
      </div>
    );
  }

  // Center on Taiwan
  const center: [number, number] = [23.7, 120.9];

  return (
    <MapContainer
      center={center}
      zoom={7}
      className="h-full w-full"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {stations
        .filter((s) => s.lat && s.lng)
        .map((station) => (
          <Marker key={station.id} position={[station.lat!, station.lng!]}>
            <Popup>
              <div className="min-w-[200px] space-y-1.5">
                <h3 className="font-bold text-foreground">{station.name}</h3>
                {station.address && (
                  <p className="flex items-start gap-1 text-xs text-muted-foreground">
                    <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                    {station.address}
                  </p>
                )}
                {station.phone && (
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3 shrink-0" />
                    <a href={`tel:${station.phone}`} className="underline">
                      {station.phone}
                    </a>
                  </p>
                )}
                {station.operating_hours && (
                  <p className="flex items-start gap-1 text-xs text-muted-foreground">
                    <Clock className="mt-0.5 h-3 w-3 shrink-0" />
                    {station.operating_hours}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
