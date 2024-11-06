import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchFeeds } from "../api/sns"; // API 호출 함수 가져오기

const Sns = () => {
  const { region } = useParams(); // URL에서 지역명을 가져옴
  const [feeds, setFeeds] = useState([]); // 피드 데이터를 저장할 상태
  const [error, setError] = useState(""); // 오류 메시지 저장

  // 각 지역별 기본 데이터를 설정
  const regionData = {
    서울: {
      title: "서울 게시판",
      imageUrl: "path_to_seoul_image.jpg",
    },
    경기도: {
      title: "경기도 게시판",
      imageUrl: "path_to_gyeonggi_image.jpg",
    },
    강원도: {
      title: "강원도 게시판",
      imageUrl: "path_to_gangwon_image.jpg",
    },
    충청도: {
      title: "충청도 게시판",
      imageUrl: "path_to_seoul_image.jpg",
    },
    전라도: {
      title: "전라도 게시판",
      imageUrl: "path_to_seoul_image.jpg",
    },
    경상도: {
      title: "경상도 게시판",
      imageUrl: "path_to_seoul_image.jpg",
    },
    제주도: {
      title: "제주도 게시판",
      imageUrl: "path_to_seoul_image.jpg",
    },
  };

  // 해당 지역의 기본 데이터를 가져옴, 없으면 기본값으로 설정
  const data = regionData[region] || {
    title: "게시판",
    imageUrl: "default_image.jpg",
  };

  // 컴포넌트가 마운트되거나 지역이 변경될 때 API 호출
  useEffect(() => {
    const loadFeeds = async () => {
      try {
        const data = await fetchFeeds(region); // API 호출
        setFeeds(data); // 데이터 상태에 저장
      } catch (error) {
        setError(error.message); // 오류 메시지 설정
      }
    };

    loadFeeds();
  }, [region]); // region이 변경될 때마다 데이터를 다시 로드

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
      <img
        src={data.imageUrl}
        alt={region}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {feeds.map((feed, index) => (
          <div key={index} className="rounded-lg overflow-hidden shadow-lg">
            <img
              src={feed.imageUrl}
              alt={feed.subRegion || feed.cityName}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">
                {feed.subRegion || feed.cityName}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sns;