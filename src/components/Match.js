import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Icon from "./image/icon.png";
import { postMatch } from "../api/match";
import Chat from "./Chat"; // Chat 컴포넌트 임포트 확인

const STEPS = {
  INIT: "INIT",
  LOADING: "LOADING",
  SHOW_POPUP: "SHOW_POPUP", // 팝업 상태 추가
  CHATTING: "CHATTING",
};

const Match = () => {
  const [step, setStep] = useState(STEPS.INIT);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [retry, setRetry] = useState(0);
  const [distance, setDistance] = useState(3);
  const [status, setStatus] = useState("매칭 중...");
  const [mapZoom, setMapZoom] = useState(14);
  const [partnerId, setPartnerId] = useState(null);
  const [popupData, setPopupData] = useState(null); // 팝업에 보여줄 데이터
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId"); // 로그인 시 저장된 userId 가져오기

  // 현재 위치를 가져오는 함수
  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("위치 정보를 가져오지 못했습니다.", error);
          alert("위치 정보를 사용할 수 없습니다. 권한을 확인해주세요.");
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("위치 정보를 지원하지 않는 브라우저입니다.");
    }
  };

  const startMatching = async () => {
    await new Promise((resolve, reject) => {
      fetchCurrentLocation();
      // 위치 정보 업데이트 후 500ms 기다림 (대안: 정확한 완료 핸들링)
      setTimeout(() => {
        if (latitude !== 0 && longitude !== 0) {
          resolve();
        } else {
          reject(new Error("위치 정보를 가져오지 못했습니다."));
        }
      }, 500);
    }).catch((error) => {
      console.error(error.message);
      alert("위치 정보를 가져오지 못했습니다. 다시 시도해주세요.");
      return;
    });

    setStep(STEPS.LOADING);
    handleMatch();
  };

  const handleMatch = async () => {
    try {
      const result = await postMatch(latitude, longitude, retry, userId);
      if (result.result === "success") {
        setStatus("매칭 성공!");
        setPopupData({ score: result.score, description: result.description });
        setStep(STEPS.SHOW_POPUP); // 팝업 상태로 전환
        setPartnerId(result.partnerId);

        // 7초 후 팝업을 숨기고 채팅 화면으로 이동
        setTimeout(() => {
          setStep(STEPS.CHATTING);
        }, 7000);
      } else {
        setRetry(retry + 1);
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
    } catch (error) {
      setStatus("매칭 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("매칭 오류:", error);
    }
  };

  useEffect(() => {
    if (step === STEPS.LOADING && distance <= 10) {
      handleMatch();
    }
  }, [distance, step]);

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
            <h2 className="text-3xl font-bold mb-4">매칭 성공!</h2>
            <p className="text-lg">점수: {popupData.score}</p>
            <p className="text-lg mb-4">설명: {popupData.description}</p>
            <p className="text-sm text-gray-300">
              잠시 후 채팅 화면으로 이동합니다...
            </p>
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
      console.error("Google Maps API가 로드되지 않았습니다.");
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

// MapComponent의 PropTypes 정의
MapComponent.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  zoom: PropTypes.number.isRequired,
};

export default Match;
