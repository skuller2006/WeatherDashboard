import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

// Fix for default Leaflet marker icons in React
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface WeatherMapProps {
  latitude: number;
  longitude: number;
  city: string;
}

// Helper component to smoothly fly the map to new coordinates
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 10, {
      duration: 2,
      easeLinearity: 0.25,
    });
  }, [center, map]);
  return null;
}

export default function WeatherMap({ latitude, longitude, city }: WeatherMapProps) {
  const center: [number, number] = [latitude, longitude];

  return (
    <div className="rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/8 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-5 pt-5 pb-3">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-500" />
          Location Map
        </h3>
      </div>
      
      <div className="flex-1 w-full min-h-[300px] relative z-0">
        <MapContainer
          center={center}
          zoom={10}
          scrollWheelZoom={false}
          className="w-full h-full absolute inset-0 z-0"
        >
          {/* We add a custom class 'map-tiles' for Dark Mode CSS inversion */}
          <TileLayer
            className="map-tiles transition-all duration-300"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={center}>
            <Popup>
              <div className="font-semibold text-gray-800">{city}</div>
            </Popup>
          </Marker>
          <MapController center={center} />
        </MapContainer>
      </div>
    </div>
  );
}
