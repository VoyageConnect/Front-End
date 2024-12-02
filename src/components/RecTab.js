import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // jwt-decode 라이브러리 임포트

const RecTab = () => {
  const [map, setMap] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // JWT 토큰에서 userId 추출
  const jwtToken = localStorage.getItem("token");
  const userId = jwtToken ? jwtDecode(jwtToken).sub : "unknown";

  console.log("JWT Token:", jwtToken);
  console.log("Decoded UserId (sub):", userId);

  // Google Maps API 로드
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // 사용자 위치 가져오기
  useEffect(() => {
    const fetchUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
            });
            setLoadingLocation(false);
          },
          (err) => {
            setError(
              "Failed to retrieve location. Please enable location services."
            );
            setLoadingLocation(false);
            console.error(err);
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
        setLoadingLocation(false);
      }
    };

    fetchUserLocation();
  }, []);

  // 추천 장소 가져오기
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (userLocation) {
        setLoadingRecommendations(true);
        setError("");
        try {
          const response = await axios.post("http://localhost:5000/recommend", {
            user_id: userId, // JWT에서 추출한 userId 사용
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          });

          const recommendations = response.data.results
            .slice(0, 5)
            .map((location) => ({
              ...location,
              latitude: parseFloat(location.latitude),
              longitude: parseFloat(location.longitude),
            }));

          setRecommendations(recommendations);
        } catch (err) {
          setError(
            "Failed to load recommended locations. Please try again later."
          );
          console.error(err);
        } finally {
          setLoadingRecommendations(false);
        }
      }
    };

    fetchRecommendations();
  }, [userLocation, userId]); // userId를 의존성에 추가

  return isLoaded ? (
    <div className="flex">
      {/* Sidebar */}
      <div
        style={{ width: "120px" }}
        className="bg-white shadow-md h-screen flex flex-col items-center py-4"
      >
        <button
          style={{ width: "50px", height: "50px", padding: "4px" }}
          onClick={() => (window.location.href = "http://localhost:3000/Home")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "40px", height: "40px" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="my-10 border-b border-gray-300"></div>

        {/* Sidebar buttons */}
        <div className="flex flex-col items-center">
          <SidebarButton
            link="http://localhost:3000/Sns"
            iconPath="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27z"
            label="Story"
          />
          <SidebarButton
            link="http://localhost:3000/Chat"
            iconPath="M8 12h8m-4 4h4m-4-8h4m-8 4h.01M4 4h16v16H4V4z"
            label="Chat"
          />
          <SidebarButton
            link="http://localhost:3000/Profile"
            iconPath="M12 14c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.33 0-10 1.67-10 5v1h20v-1c0-3.33-6.67-5-10-5z"
            label="Profile"
          />
          <SidebarButton
            link="#"
            iconPath="M12 8.5v3.5m0 0v3.5m0-3.5h3.5m-3.5 0H8.5m8.5 0a1 1 0 011 1v0a1 1 0 01-.25.67l-2.5 2.5a1 1 0 01-.67.25h-0a1 1 0 01-1-1v-3.5a1 1 0 011-1h0zm-8.5 0a1 1 0 00-1 1v0a1 1 0 00.25.67l2.5 2.5a1 1 0 00.67.25h0a1 1 0 001-1v-3.5a1 1 0 00-1-1h0z"
            label="Setting"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-4xl font-bold mb-4">AI Service</h1>
        {error && <p className="text-red-500">{error}</p>}

        {loadingLocation ? (
          <p>Loading user location...</p>
        ) : userLocation ? (
          <>
            <h2 className="text-xl font-semibold mb-4">
              📌 Recommended Locations
            </h2>
            <GoogleMap
              mapContainerStyle={{ height: "500px", width: "100%" }}
              center={{
                lat: userLocation.latitude,
                lng: userLocation.longitude,
              }}
              zoom={13}
              onLoad={(mapInstance) => setMap(mapInstance)}
            >
              <Marker
                position={{
                  lat: userLocation.latitude,
                  lng: userLocation.longitude,
                }}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                }}
                onClick={() =>
                  setSelectedLocation({
                    name: "Your Location",
                    description: "You are here",
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                  })
                }
              />

              {recommendations.map((location, index) => (
                <Marker
                  key={index}
                  position={{
                    lat: location.latitude,
                    lng: location.longitude,
                  }}
                  onClick={() => setSelectedLocation(location)}
                />
              ))}

              {selectedLocation && (
                <InfoWindow
                  position={{
                    lat: selectedLocation.latitude,
                    lng: selectedLocation.longitude,
                  }}
                  onCloseClick={() => setSelectedLocation(null)}
                >
                  <div>
                    <h4>{selectedLocation.name}</h4>
                    <p>{selectedLocation.description}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>

            {/* 추천 장소 목록 표시 */}
            <div className="bg-white p-4 rounded-lg shadow-md mt-4">
              <h3 className="text-xl font-bold mb-2">
                📌 Nearby Recommendations
              </h3>
              {loadingRecommendations ? (
                <p>Loading recommendations...</p>
              ) : recommendations.length > 0 ? (
                recommendations.map((location, index) => (
                  <div
                    key={index}
                    className="bg-blue-100 p-4 rounded-lg flex justify-between items-center mb-2"
                  >
                    <div>
                      <h4 className="font-semibold">{location.name}</h4>
                      <p>{location.description}</p>
                      <p>
                        Distance:{" "}
                        {location.distance
                          ? location.distance.toFixed(2) + " km"
                          : "N/A"}
                      </p>
                      <p>Type: {location.type}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No recommendations available.</p>
              )}
            </div>
          </>
        ) : (
          <p>Location not available.</p>
        )}
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default RecTab;

// Sidebar 버튼 컴포넌트
const SidebarButton = ({ link, iconPath, label }) => (
  <button
    className="mb-12 flex flex-col items-center justify-center"
    style={{ width: "60px", height: "60px" }}
    onClick={() => (window.location.href = link)}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d={iconPath}
      />
    </svg>
    <span className="text-xs">{label}</span>
  </button>
);
