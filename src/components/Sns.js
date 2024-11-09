import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchFeeds } from "../api/sns"; // API 호출 함수 가져오기
import "./Sns.css"; // CSS 파일 임포트

const Sns = () => {
  const { region } = useParams(); // URL에서 지역명을 가져옴
  const [feeds, setFeeds] = useState([]); // 피드 데이터를 저장할 상태
  const [error, setError] = useState(""); // 오류 메시지 저장

  // 각 지역별 기본 데이터를 설정
  const regionData = {
    서울특별시: { title: "서울 게시판", imageUrl: "path_to_seoul_image.jpg" },
    부산광역시: { title: "부산 게시판", imageUrl: "path_to_busan_image.jpg" },
    대구광역시: { title: "대구 게시판", imageUrl: "path_to_daegu_image.jpg" },
    인천광역시: { title: "인천 게시판", imageUrl: "path_to_incheon_image.jpg" },
    광주광역시: { title: "광주 게시판", imageUrl: "path_to_gwangju_image.jpg" },
    대전광역시: { title: "대전 게시판", imageUrl: "path_to_daejeon_image.jpg" },
    울산광역시: { title: "울산 게시판", imageUrl: "path_to_ulsan_image.jpg" },
    경기도: { title: "경기도 게시판", imageUrl: "path_to_gyeonggi_image.jpg" },
    강원도: { title: "강원도 게시판", imageUrl: "path_to_gangwon_image.jpg" },
    충청북도: {
      title: "충청북도 게시판",
      imageUrl: "path_to_chungbuk_image.jpg",
    },
    충청남도: {
      title: "충청남도 게시판",
      imageUrl: "path_to_chungnam_image.jpg",
    },
    전라북도: {
      title: "전라북도 게시판",
      imageUrl: "path_to_jeonbuk_image.jpg",
    },
    전라남도: {
      title: "전라남도 게시판",
      imageUrl: "path_to_jeonnam_image.jpg",
    },
    경상북도: {
      title: "경상북도 게시판",
      imageUrl: "path_to_gyeongbuk_image.jpg",
    },
    경상남도: {
      title: "경상남도 게시판",
      imageUrl: "path_to_gyeongnam_image.jpg",
    },
    제주특별자치도: {
      title: "제주 게시판",
      imageUrl: "path_to_jeju_image.jpg",
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
    <div className="container">
      <h1 className="title">{data.title}</h1>
      <img src={data.imageUrl} alt={region} className="image" />
      {error && <p className="error">{error}</p>}
      <div className="feed-grid">
        {feeds.length > 0 ? (
          feeds.map((feed, index) => (
            <div key={index} className="feed-card">
              <img
                src={feed.photoUrl}
                alt={feed.subLocation}
                className="feed-image"
              />
              <div className="feed-title">{feed.subLocation}</div>
            </div>
          ))
        ) : (
          <p className="text-center">게시글이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Sns;
