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
      locationName: "서울특별시",
      imageUrl:
        "https://www.agitano.com/wp-content/uploads/2023/08/agitano-seoul-besuchen.webp",
    },
    {
      id: 2,
      locationName: "부산광역시",
      imageUrl:
        "https://dimg.donga.com/ugc/CDB/SHINDONGA/Article/61/b0/68/2f/61b0682f1ce9d2738276.jpg",
    },
    {
      id: 3,
      locationName: "대구광역시",
      imageUrl:
        "https://www.ktsketch.co.kr/news/photo/201907/4254_15444_1925.gif",
    },
    {
      id: 4,
      locationName: "인천광역시",
      imageUrl:
        "https://image.ajunews.com/content/image/2022/01/20/20220120075349600660.jpg",
    },
    {
      id: 5,
      locationName: "광주광역시",
      imageUrl:
        "http://gjtravel.or.kr/user/default/data/2022/04/003008_16506045290.427586001650604529.jpg",
    },
    {
      id: 6,
      locationName: "대전광역시",
      imageUrl:
        "https://www.newsro.kr/wp-content/uploads/2020/12/%EB%AF%BC%EC%84%A07%EA%B8%B0-%EC%83%88%EB%A1%9C%EC%9A%B4-%EB%B3%80%ED%99%94%EB%A1%9C-%EC%9D%BC%EA%B5%B0-%EB%8C%80%EC%A0%84%EC%97%AD%EC%84%B8%EA%B6%8C-%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD-%ED%98%81%EC%8B%A0%EC%84%B1%EC%9E%A5-%EC%A4%91%EC%8B%AC%EC%97%90-%EC%84%9C%EB%8B%A4-%EC%A1%B0%EA%B0%90%EB%8F%84.jpg",
    },
    {
      id: 7,
      locationName: "울산광역시",
      imageUrl:
        "https://news.unist.ac.kr/kor/wp-content/uploads/2016/10/%ED%83%9C%ED%99%94%EA%B0%95%EC%9A%B8%EC%82%B0-800x530.jpg",
    },
    {
      id: 8,
      locationName: "경기도",
      imageUrl:
        "https://cdn.weeklytoday.com/news/photo/202104/354110_360206_3913.jpg",
    },
    {
      id: 9,
      locationName: "강원도",
      imageUrl:
        "https://cdn.gangneungnews.kr/news/photo/202205/35021_34551_1039.jpg",
    },
    {
      id: 10,
      locationName: "충청북도",
      imageUrl:
        "https://www.dydailynews.com/imgdata/dydailynews_com/201707/2017073156281496.jpg",
    },
    {
      id: 11,
      locationName: "충청남도",
      imageUrl:
        "https://cdn.bzeronews.com/news/photo/202101/467638_690258_2359.jpg",
    },
    {
      id: 12,
      locationName: "전라북도",
      imageUrl:
        "https://www.jbyonhap.com/news/photo/202201/364959_448935_2324.jpg",
    },
    {
      id: 13,
      locationName: "전라남도",
      imageUrl:
        "http://www.travelnbike.com/news/photo/201708/43088_42546_3116.jpg",
    },
    {
      id: 14,
      locationName: "경상북도",
      imageUrl:
        "https://www.ekn.kr/mnt/file/202202/2022021601000636700026571.jpg",
    },
    {
      id: 15,
      locationName: "경상남도",
      imageUrl:
        "https://cdn.ftoday.co.kr/news/photo/202106/217628_217746_1613.png",
    },
    {
      id: 16,
      locationName: "제주특별자치도",
      imageUrl:
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/59/c2/e9/caption.jpg?w=1200&h=900&s=1",
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
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
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
      <div className="bg-white shadow-lg rounded-lg p-20 w-full max-w-4xl min-h-screen flex flex-col items-center justify-center text-center relative z-10">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Voyage Connect ✈️
        </h1>
        <p className="text-gray-600 mb-8">
          새로운 만남과 함께 여행 경험을 쌓아보세요!
        </p>

        {/* 매칭 및 추천 버튼 */}
        <div className="flex justify-center space-x-4 mb-20">
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
            <FaMapMarkedAlt className="mr-2" /> 추천장소
          </button>
        </div>

        {/* 가로 구분선 */}
        <div className="border-t-2 border-gray-300 w-full mb-10"></div>

        {/* 여행 버킷리스트 슬라이더 */}
        <div className="w-full px-10 mt-10">
          <h2 className="text-2xl font-bold mb-4 text-left">SNS 게시판</h2>
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
