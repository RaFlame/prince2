"use client"

import { useEffect } from "react"
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { therneyVoyage, type LatLng } from "@/lib/vessel-therney"

const departureIcon = L.divIcon({
  className: "",
  html: `<span style="display:block;width:12px;height:12px;border-radius:9999px;background:#1d4ed8;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.35)"></span>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
})

const arrivalIcon = L.divIcon({
  className: "",
  html: `<span style="display:block;width:12px;height:12px;border-radius:9999px;background:#047857;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.35)"></span>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
})

function FitBounds({ points }: { points: LatLng[] }) {
  const map = useMap()
  useEffect(() => {
    if (points.length === 0) return
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]))
    map.fitBounds(bounds, { padding: [28, 28] })
  }, [map, points])
  return null
}

export function TherneyVoyageMap() {
  const past = therneyVoyage.pastTrack
  const forecast = therneyVoyage.routeForecast
  const allPoints = [...past, ...forecast]

  return (
    <MapContainer
      className="h-[200px] w-full rounded-sm"
      center={[61.5, -2.5]}
      zoom={4}
      scrollWheelZoom={false}
      style={{ zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds points={allPoints} />
      <Polyline
        positions={past.map((p) => [p.lat, p.lng])}
        pathOptions={{ color: "#1d4ed8", weight: 3, opacity: 0.85 }}
      />
      <Polyline
        positions={forecast.map((p) => [p.lat, p.lng])}
        pathOptions={{
          color: "#047857",
          weight: 3,
          opacity: 0.75,
          dashArray: "6 6",
        }}
      />
      <Marker
        position={[
          therneyVoyage.departure.coords.lat,
          therneyVoyage.departure.coords.lng,
        ]}
        icon={departureIcon}
      >
        <Popup>
          {therneyVoyage.departure.place.en} {therneyVoyage.departure.code}
        </Popup>
      </Marker>
      <Marker
        position={[
          therneyVoyage.arrival.coords.lat,
          therneyVoyage.arrival.coords.lng,
        ]}
        icon={arrivalIcon}
      >
        <Popup>
          {therneyVoyage.arrival.place.en} {therneyVoyage.arrival.code}
        </Popup>
      </Marker>
    </MapContainer>
  )
}
