import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Icon from "./image/icon.png";
import { postMatch } from "../api/match";
import Chat from "./Chat";

const STEPS = {
  INIT: "INIT",
  LOADING: "LOADING",
  SHOW_POPUP: "SHOW_POPUP",
  CHATTING: "CHATTING",
};

const Match = () => {
  const [step, setStep] = useState(STEPS.INIT);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [retry, setRetry] = useState(0);
  const [distance, setDistance] = useState(3);
  const [status, setStatus] = useState("매칭 중...");
  const [mapZoom, setMapZoom] = useState(14);
  const [partnerId, setPartnerId] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const navigate = useNavigate();

  const jwtToken = localStorage.getItem("token");
  const userId = jwtToken ? jwtDecode(jwtToken).sub : "unknown";

  console.log("JWT Token:", jwtToken);
  console.log("Decoded UserId (sub):", userId);

  const fetchCurrentLocation = () => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            resolve();
          },
          () => {
            setLatitude(37.5665);
            setLongitude(126.978);
            resolve();
          },
          { enableHighAccuracy: true }
        );
      } else {
        setLatitude(37.5665);
        setLongitude(126.978);
        resolve();
      }
    });
  };

  const startMatching = async () => {
    try {
      await fetchCurrentLocation();

      if (!latitude || !longitude) {
        return;
      }

      setStep(STEPS.LOADING);
      handleMatch();
    } catch (err) {
      console.error("Error during startMatching:", err);
    }
  };

  const handleMatch = useCallback(async () => {
    try {
      const result = await postMatch(latitude, longitude, retry, userId);
      if (result.result === "success") {
        setStatus("매칭 성공!");
        setPopupData({ score: result.score, description: result.description });
        setStep(STEPS.SHOW_POPUP);
        setPartnerId(result.partnerId);

        setTimeout(() => {
          setStep(STEPS.CHATTING);
        }, 7000);
      } else {
        setRetry((prevRetry) => prevRetry + 1);
        if (distance === 3) {
          setDistance(5);
          setMapZoom(12);
        } else if (distance === 5) {
          setDistance(10);
          setMapZoom(10);
        } else {
          navigate("/home");
        }
      }
    } catch (err) {
      console.error("매칭 중 오류 발생:", err);
      setStatus("매칭 실패. 다시 시도해 주세요.");
    }
  }, [latitude, longitude, retry, userId, distance, navigate]);

  useEffect(() => {
    if (step === STEPS.LOADING && distance <= 10) {
      handleMatch();
    }
  }, [distance, step, handleMatch]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-[#6a11cb] to-[#2575fc] relative">
      <img
        src={Icon}
        alt="설명"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="bg-white p-10 rounded-lg shadow-lg text-center w-1/3 z-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">랜덤 매칭</h1>
        <p className="text-gray-600 mb-4">새로운 친구와 대화를 나눠 보세요!</p>
        {step === STEPS.INIT && (
          <button
            className="bg-blue-600 text-white px-8 py-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            onClick={startMatching}
          >
            랜덤 매칭 시작
          </button>
        )}
        {step === STEPS.LOADING && (
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-t-transparent border-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-xl font-semibold text-gray-700">{status}</p>
            <div style={{ height: "500px", width: "100%" }}>
              <MapComponent
                latitude={latitude}
                longitude={longitude}
                zoom={mapZoom}
              />
            </div>
          </div>
        )}
        {step === STEPS.SHOW_POPUP && popupData && (
          <div className="bg-gray-800 bg-opacity-75 p-6 rounded-lg text-white absolute inset-0 flex flex-col items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                매칭 성공!
              </h2>
              <p className="text-lg text-gray-700">점수: {popupData.score}</p>
              <p className="text-lg mb-4 text-gray-700">
                설명: {popupData.description}
              </p>
              <p className="text-sm text-gray-500">
                잠시 후 채팅 화면으로 이동합니다...
              </p>
            </div>
          </div>
        )}
        {step === STEPS.CHATTING && partnerId && (
          <Chat userId={userId} partnerId={partnerId} />
        )}
      </div>
    </div>
  );
};

const MapComponent = ({ latitude, longitude, zoom }) => {
  useEffect(() => {
    if (!window.google) {
      return;
    }

    const mapOptions = {
      center: { lat: latitude, lng: longitude },
      zoom: zoom,
    };

    const map = new window.google.maps.Map(
      document.getElementById("map"),
      mapOptions
    );

    new window.google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: map,
    });
  }, [latitude, longitude, zoom]);

  return <div id="map" style={{ width: "100%", height: "100%" }} />;
};

MapComponent.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  zoom: PropTypes.number.isRequired,
};

export default Match;
