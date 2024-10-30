import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { getRecommendedLocations, parseJwt } from "../api/recTab";

const RecTab = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    // 사용자의 실시간 위치를 가져오기
    const fetchUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });
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

  useEffect(() => {
    // 사용자의 위치가 설정된 후 추천 장소 가져오기
    const fetchRecommendations = async () => {
      if (userLocation) {
        setLoadingRecommendations(true);
        setError("");
        try {
          const token = localStorage.getItem("jwtToken"); // 저장된 토큰 가져오기
          const decodedPayload = parseJwt(token);
          const userId = decodedPayload ? decodedPayload.userId : "defaultUser"; // JWT payload에서 userId 추출

          // 추천 장소 API 호출
          const results = await getRecommendedLocations(
            userId,
            userLocation.latitude,
            userLocation.longitude
          );

          // 5개 장소만 설정
          setRecommendations(results.slice(0, 5));
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
  }, [userLocation]);

  return (
    <div className="container">
      <h2>Recommended Locations</h2>

      {error && <p className="error">{error}</p>}

      {loadingLocation ? (
        <p>Loading user location...</p>
      ) : userLocation ? (
        <>
          {loadingRecommendations ? (
            <p>Loading recommended locations...</p>
          ) : (
            <LoadScript googleMapsApiKey="AIzaSyCNH8xLS_XvX0pVVSYtBNjCUxc50iwgb20">
              <GoogleMap
                mapContainerStyle={{ height: "500px", width: "100%" }}
                center={{
                  lat: userLocation.latitude,
                  lng: userLocation.longitude,
                }}
                zoom={13}
              >
                {/* 사용자의 현재 위치에 마커 표시 */}
                <Marker
                  position={{
                    lat: userLocation.latitude,
                    lng: userLocation.longitude,
                  }}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // 사용자 위치를 나타내는 파란색 마커
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
            </LoadScript>
          )}
        </>
      ) : (
        <p>Location not available.</p>
      )}
    </div>
  );
};

export default RecTab;
