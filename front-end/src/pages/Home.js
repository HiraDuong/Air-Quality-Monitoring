import React, { useState } from 'react';
import '../css/Home.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { dataLocationItems } from '../data/data';
import LocationItem from '../components/LocationItem/LocationItem';
import SearchLocation from '../components/SearchLocation/SearchLocation';

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0); // State để lưu chỉ số hiện tại của slider
  const sliderData = dataLocationItems.slice(currentIndex, currentIndex + 2); 

  // Xử lý khi nhấn nút trái
  const handlePrevious = () => {
    if (currentIndex === 0) {
      setCurrentIndex(dataLocationItems.length - 2); // Quay lại phần tử cuối cùng của danh sách
    } else {
      setCurrentIndex(currentIndex - 2);
    }
  };

  // Xử lý khi nhấn nút phải
  const handleNext = () => {
    if (currentIndex + 2 >= dataLocationItems.length) {
      setCurrentIndex(0); // Quay lại phần tử đầu tiên nếu đến cuối danh sách
    } else {
      setCurrentIndex(currentIndex + 2);
    }
  };

  return (
    <div className="home-page">
      <h1>Home</h1>
      <SearchLocation data={dataLocationItems} />
      <div className="slider">
        <button className="slider-button" onClick={handlePrevious}>
          <FaArrowLeft size={30} />
        </button>
        {sliderData.map((item) => (
          <div className="slider-item" key={item.location}>
            <LocationItem location={item} />
          </div>
        ))}
        <button className="slider-button" onClick={handleNext}>
          <FaArrowRight size={30} />
        </button>
      </div>
    </div>
  );
};

export default Home;
