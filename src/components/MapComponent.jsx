import React, { useEffect, useState } from "react";
import L from "leaflet";
// import AxiosService from "../utilis/ApiService";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";

// custom Icons
const mapIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});
const vehicleIcon = new L.Icon({
  iconUrl: "/assets/Images/OIP (2).jpeg",
  iconSize: [30, 45],
  iconAnchor: [16, 32],
});

function MapComponent() {
  const initialPosition = [19.99727, 73.79096]; // Nashik - Maharashtra
  // [10.78523000, 79.13909000] //Thanjavur

  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket("ws://localhost:8080");

      ws.onopen = () => {
        console.log("WebSocket connection is established");
      };

      ws.onmessage = (e) => {
        const location = JSON.parse(e.data);
        setLocations((prev) => [...prev, location]);
        setCurrentLocation(location); // Update current Location
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        // ws.close();
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected, attempting to reconnect...");
        setTimeout(connectWebSocket, 3000); //Retry connection every 3 seconds
      };
    };
    connectWebSocket();
  }, []);

  return (
    <MapContainer
      center={initialPosition}
      zoom={10}
      style={{ height: "100vh" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {/* Open Street Map Link */}

      {/* Initial Marker (Static)  */}
      <Marker position={initialPosition} icon={mapIcon}></Marker>

      {/* Moving car Marker */}
      {currentLocation && (
        <Marker
          // position={initialPosition}
          position={[currentLocation.latitude, currentLocation.longitude]}
          icon={vehicleIcon}
        ></Marker>
      )}

      {/* Ployline Drawing */}
      <Polyline
        positions={locations.map((loc) => [loc.latitude, loc.longitude])}
        color="blue"
      />
    </MapContainer>
  );
}

export default MapComponent;
