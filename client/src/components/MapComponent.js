
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon missing in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = ({ items }) => {
    // Mock function to generate random coordinates near a center point (e.g., Campus)
    // In a real app, 'item.location' from DB would be geocoded to [lat, lng]
    const getMockPosition = (index) => {
        const baseLat = 12.9716; // Example: Bangalore 
        const baseLng = 77.5946;
        const offset = 0.005; // Spread items slightly
        return [baseLat + (Math.random() - 0.5) * offset, baseLng + (Math.random() - 0.5) * offset];
    };

    const center = [12.9716, 77.5946]; // Default Center

    return (
        <div style={{ height: '400px', width: '100%', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {items.map((item, index) => {
                    // Create a persistent mock location based on item ID hash or index to avoid jumping on re-render if possible
                    // For simple demo, we just generate once or assume items have lat/long. 
                    // Since we don't have lat/long, we'll randomize for "recent" items visual flair.
                    const position = getMockPosition(index);

                    return (
                        <Marker key={item.id} position={position}>
                            <Popup>
                                <strong>{item.type.toUpperCase()}: {item.title}</strong><br />
                                {item.location}
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
