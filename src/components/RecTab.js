import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getRecommendedLocations } from "../api/recTab";
import L from "leaflet";

const RecTab = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // 사용자의 실시간 위치를 가져오기
    const fetchUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });
          },
          (err) => {
            setError(
              "Failed to retrieve location. Please enable location services."
            );
            console.error(err);
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    };

    fetchUserLocation();
  }, []);

  useEffect(() => {
    // 사용자의 위치가 설정된 후 추천 장소 가져오기
    const fetchRecommendations = async () => {
      if (userLocation) {
        setError("");
        try {
          const userId = "defaultUser"; // 고정된 userId 사용

          // 추천 장소 API 호출
          const results = await getRecommendedLocations(
            userId,
            userLocation.latitude,
            userLocation.longitude
          );

          // 5개 장소만 설정
          setRecommendations(results.slice(0, 5));
        } catch (err) {
          setError(err.message);
        }
      }
    };

    fetchRecommendations();
  }, [userLocation]);

  const defaultIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <div className="container">
      <h2>Recommended Locations</h2>

      {error && <p className="error">{error}</p>}

      {userLocation ? (
        <MapContainer
          center={[userLocation.latitude, userLocation.longitude]} // 사용자의 실시간 위치를 중심으로 설정
          zoom={13}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {recommendations.map((location, index) => (
            <Marker
              key={index}
              position={[location.latitude, location.longitude]}
              icon={defaultIcon}
            >
              <Popup>
                <h4>{location.name}</h4>
                <p>{location.description}</p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <p>Loading user location...</p>
      )}
    </div>
  );
};

export default RecTab;
