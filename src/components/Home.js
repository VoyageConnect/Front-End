import React from "react";
import image1 from "./image/image1.jpg";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { FaPlaneDeparture, FaMapMarkedAlt, FaSignOutAlt } from "react-icons/fa";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md"; // 올바른 아이콘 임포트
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const navigate = useNavigate();

  const travelList = [
    {
      id: 1,
      locationName: "서울",
      imageUrl: "path_to_image1.jpg",
    },
    {
      id: 2,
      locationName: "경기도",
      imageUrl: "path_to_image2.jpg",
    },
    {
      id: 3,
      locationName: "강원도",
      imageUrl: "path_to_image3.jpg",
    },
    {
      id: 4,
      locationName: "충청도",
      imageUrl: "path_to_image1.jpg",
    },
    {
      id: 5,
      locationName: "전라도",
      imageUrl: "path_to_image1.jpg",
    },
    {
      id: 6,
      locationName: "경상도",
      imageUrl: "path_to_image1.jpg",
    },
    {
      id: 7,
      locationName: "제주도",
      imageUrl: "path_to_image1.jpg",
    },
  ];

  const CustomPrevArrow = (props) => {
    const { onClick } = props;
    return (
      <div
        className="absolute z-10 text-3xl text-gray-600 hover:text-gray-800 cursor-pointer"
        style={{ top: "50%", transform: "translateY(-50%)", left: "-30px" }} // 왼쪽 여백 추가
        onClick={onClick}
      >
        <MdArrowBackIosNew />
      </div>
    );
  };

  const CustomNextArrow = (props) => {
    const { onClick } = props;
    return (
      <div
        className="absolute z-10 text-3xl text-gray-600 hover:text-gray-800 cursor-pointer"
        style={{ top: "50%", transform: "translateY(-50%)", right: "-30px" }} // 오른쪽 여백 추가
        onClick={onClick}
      >
        <MdArrowForwardIos />
      </div>
    );
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />, // 커스텀 이전 화살표
    nextArrow: <CustomNextArrow />, // 커스텀 다음 화살표
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handleShowRecommendations = () => {
    navigate("/rectab");
  };

  const handleMatchButtonClick = () => {
    navigate("/match");
  };

  const handleLogout = () => {
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative">
      {/* 배경 이미지 */}
      <img
        src={image1}
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        alt="background"
      />

      {/* 로그아웃 버튼 */}
      <div className="absolute top-4 right-4 z-10">
        <button
          className="bg-white shadow-lg text-gray-800 rounded-lg p-3 hover:bg-gray-300 transition duration-300 flex items-center"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="mr-2" />
          Log out
        </button>
      </div>

      {/* 메인 콘텐츠 박스 */}
      <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-4xl min-h-screen flex flex-col items-center justify-center text-center relative z-10">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Voyage Connect
        </h1>
        <p className="text-gray-600 mb-8">
          새로운 만남과 함께 여행 경험을 쌓아보세요!
        </p>

        {/* 매칭 및 추천 버튼 */}
        <div className="flex justify-center space-x-4 mb-56">
          {" "}
          {/* 여백 추가 */}
          <button
            className="bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 flex items-center"
            onClick={handleMatchButtonClick}
          >
            <FaPlaneDeparture className="mr-2" /> 매칭하기
          </button>
          <button
            className="bg-green-600 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:bg-green-700 transition duration-300 flex items-center"
            onClick={handleShowRecommendations}
          >
            <FaMapMarkedAlt className="mr-2" /> 추천 장소
          </button>
        </div>

        {/* 가로 구분선 */}
        <div className="border-t-2 border-gray-300 w-full mb-10"></div>

        {/* 여행 버킷리스트 슬라이더 */}
        <div className="w-full px-10 mt-10">
          <h2 className="text-2xl font-bold mb-4 text-left">Sns 게시판</h2>
          <p className="text-gray-500 mb-8 text-left">
            각 지역마다 올라온 사진들을 구경하세요!
          </p>

          <Slider {...sliderSettings} className="travel-slider">
            {travelList.map((item) => (
              <div
                key={item.id}
                className="travel-card p-4 cursor-pointer"
                onClick={() => navigate(`/board/${item.locationName}`)} // 클릭 시 해당 게시판으로 이동
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={item.imageUrl}
                    alt={item.locationName}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-0 bg-black bg-opacity-50 text-white p-4 w-full">
                    <h3>{item.locationName}</h3>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Home;
