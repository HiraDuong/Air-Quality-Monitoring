import React, { useEffect, useState } from 'react';
import '../css/Home.css';
import { MdOutlineArrowBackIosNew,MdOutlineArrowForwardIos } from "react-icons/md";

import LocationItem from '../components/LocationItem/LocationItem';
import SearchLocation from '../components/SearchLocation/SearchLocation';

import mqtt from 'mqtt';

const Home = () => {
  const [dataLocationItems, setDataLocationItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Định nghĩa hàm fetchData để fetch dữ liệu từ API
  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/newest`, {
        headers: {
          'Content-Type': 'application/json',
          'auth-token': 1 // Assuming this is your authentication token
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setDataLocationItems(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error (e.g., show error message to user)
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    // Khởi tạo kết nối MQTT
    const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');
    client.on('connect', () => {
      console.log('Connected to MQTT over Ws broker');
      client.subscribe('iot-1147707_nhom5/ws');
    });
    client.on('message', (topic, message) => {
      console.log('Received message from MQTT broker');
      fetchData(); // Fetch new data when receiving message
    });

    return () => {
      client.end(); // Clean up MQTT client on component unmount
    };
  }, []); // Empty dependency array means this effect runs only once

  // Xử lý khi nhấn nút trái
  const handlePrevious = () => {
    if (currentIndex === 0) {
      setCurrentIndex(dataLocationItems.length - 2);
    } else {
      setCurrentIndex(currentIndex - 2);
    }
  };

  // Xử lý khi nhấn nút phải
  const handleNext = () => {
    if (currentIndex + 2 >= dataLocationItems.length) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 2);
    }
  };

  // Lấy danh sách dữ liệu cho slider
  const sliderData = dataLocationItems.slice(currentIndex, currentIndex + 2);

  return (
    <div className="home-page">
      <h1>Home</h1>
      <SearchLocation data={dataLocationItems} />
      <div className="slider">
        <button className="slider-button" onClick={handlePrevious}>
          <MdOutlineArrowBackIosNew  size={40} color='#5B5B5B' />
        </button>
        {sliderData.map((item) => (
          <div className="slider-item" key={item.location}>
            <LocationItem location={item} />
          </div>
        ))}
        <button className="slider-button" onClick={handleNext}>
          <MdOutlineArrowForwardIos size={40} color='#5B5B5B' />
        </button>
      </div>
    </div>
  );
};

export default Home;
