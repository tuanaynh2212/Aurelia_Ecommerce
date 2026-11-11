import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import L, { type LatLngExpression, type LatLngTuple } from "leaflet";
import { CSS } from "../UI/three/palette";

export type RightProps = {
  data: unknown;
  id: string | undefined;
};

interface TrackingPayload {
  lat?: number;
  ion?: number;
  shopName?: string;
  data?: {
    lat?: number;
    ion?: number;
    name?: string;
    address?: string;
  };
}

const createPinIcon = (label: string, fill: string, textFill: string) =>
  L.divIcon({
    className: "aurelia-map-pin",
    html: `<div style="display:inline-flex;align-items:center;justify-content:center;padding:3px 7px;background:${fill};color:${textFill};border:2px solid ${CSS.ink};box-shadow:3px 3px 0px ${CSS.ink};font-family:monospace;font-weight:800;font-size:10px;letter-spacing:0.06em;white-space:nowrap;">${label}</div>`,
    iconSize: [68, 26],
    iconAnchor: [34, 26],
  });

const shopIcon = createPinIcon("ATELIER", CSS.ink, CSS.paper);
const shipperIcon = createPinIcon("COURIER", CSS.flash, CSS.paper);
const customerIcon = createPinIcon("CLIENT", CSS.volt, CSS.ink);

const FitMap: React.FC<{ route: LatLngTuple[] }> = ({ route }) => {
  const map = useMap();
  useEffect(() => {
    if (route.length) map.fitBounds(route);
  }, [route, map]);
  return null;
};

const RightSiteMap: React.FC<RightProps> = ({ data, id }: RightProps) => {
  const [route, setRoute] = useState<LatLngTuple[]>([]);
  const payload = data as TrackingPayload | undefined;
  const shop: LatLngTuple | null =
    payload?.lat !== undefined && payload?.ion !== undefined
      ? [payload.lat, payload.ion]
      : null;
  const customer: LatLngTuple | null =
    payload?.data?.lat !== undefined && payload?.data?.ion !== undefined
      ? [payload.data.lat, payload.data.ion]
      : null;
  const shipper: LatLngTuple = [10.762622, 106.660172];

  useEffect(() => {
    if (!shop || !customer) return;

    const fetchRoute = async () => {
      try {
        const coords = `${shop[1]},${shop[0]};${customer[1]},${customer[0]}`;
        const res = await fetch(
          `https://us1.locationiq.com/v1/directions/driving/${coords}?key=${
            import.meta.env.VITE_LOCATIONIQ_KEY
          }&geometries=geojson`
        );
        const json = await res.json();
        const geo = json.routes?.[0]?.geometry?.coordinates ?? [];
        setRoute(geo.map(([lon, lat]: [number, number]) => [lat, lon]));
      } catch (e) {
        console.error(e);
      }
    };

    fetchRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="relative w-full h-full min-h-[60vh]">
      {/* Sibling pointer-events-none Map HUD Badge */}
      <div className="pointer-events-none absolute top-4 right-4 z-[400] flex items-center gap-2">
        <span className="hud-chip bg-[var(--color-volt)] text-[var(--color-ink)]">
          [LIVE TELEMETRY // POSITRON]
        </span>
      </div>

      <MapContainer
        center={(shop || shipper) as LatLngExpression}
        zoom={4}
        className="w-full h-[100vh]"
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

        {shop && (
          <Marker position={shop} icon={shopIcon}>
            <Popup>
              <div className="font-mono text-xs font-bold">
                ATELIER ORIGIN · {payload?.shopName || "Flagship"}
              </div>
            </Popup>
          </Marker>
        )}
        {customer && (
          <Marker position={customer} icon={customerIcon}>
            <Popup>
              <div className="font-mono text-xs font-bold">
                DESTINATION · {payload?.data?.name || "Client"}
              </div>
            </Popup>
          </Marker>
        )}
        <Marker position={shipper} icon={shipperIcon}>
          <Popup>
            <div className="font-mono text-xs font-bold">
              AURELIA COURIER UNIT
            </div>
          </Popup>
        </Marker>

        {route.length > 0 && (
          <>
            <Polyline
              positions={route}
              pathOptions={{
                color: CSS.ink,
                weight: 4,
                opacity: 0.9,
                dashArray: "8 6",
              }}
            />
            <FitMap route={route} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default RightSiteMap;
