import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import axios from "axios";

const RecTab = () => {
  const [map, setMap] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCNH8xLS_XvX0pVVSYtBNjCUxc50iwgb20",
    libraries: ["places"],
  });

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

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (userLocation) {
        setLoadingRecommendations(true);
        setError("");
        try {
          const userId = "defaultUser";
          const response = await axios.post("http://localhost:5000/recommend", {
            user_id: userId,
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
  }, [userLocation]);

  return isLoaded ? (
    <div className="container">
      <h2>Recommended Locations</h2>
      {error && <p className="error">{error}</p>}
      {loadingLocation ? (
        <p>Loading user location...</p>
      ) : userLocation ? (
        <>
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

          {/* 지도 아래 추천 장소 목록 표시 */}
          <div className="recommendations-list">
            <h3>Nearby Recommendations</h3>
            {loadingRecommendations ? (
              <p>Loading recommendations...</p>
            ) : recommendations.length > 0 ? (
              recommendations.map((location, index) => (
                <div key={index} className="recommendation-item">
                  <h4>{location.name}</h4>
                  <p>{location.description}</p>
                  <p>
                    Distance:{" "}
                    {location.distance
                      ? location.distance.toFixed(2) + " km"
                      : "N/A"}
                  </p>
                  <p>Type: {location.type}</p>
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
  ) : (
    <p>Loading...</p>
  );
};

export default RecTab;
