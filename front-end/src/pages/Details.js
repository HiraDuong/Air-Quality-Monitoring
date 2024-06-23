import React from "react";
import "../css/Details.css";


import DeviceWeatherInfo from "../components/DeviceWeatherInfo/DeviceWeatherInfo";
import BarChart from "../components/Chart/BarChart";
import { useLocation } from "react-router-dom";
import {
  TiWeatherDownpour,
  TiWeatherPartlySunny,
  TiWeatherShower,
  TiWeatherSnow,
  TiWeatherStormy,
  TiWeatherSunny,
} from "react-icons/ti";

import { useEffect } from "react";
import mqtt from 'mqtt'
const Details = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");


  const [displayHourly, setDisplayHourly] = React.useState(true);
  const [displayDaily, setDisplayDaily] = React.useState(false);

  const [newestData, setNewestData] = React.useState({});
  const [historicHourlyData, setDisplayHourlyData] = React.useState([]);
  const handleDisplayHourly = () => {
    setDisplayHourly(true);
    setDisplayDaily(false);
  };

  const handleDisplayDaily = () => {
    setDisplayHourly(false);
    setDisplayDaily(true);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/historic/id/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": 1, // Assuming this is your authentication token
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setDisplayHourlyData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error (e.g., show error message to user)
    }
  };
  const fetchNewestData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/newest/id/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": 1, // Assuming this is your authentication token
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const newest = await response.json();
      setNewestData(newest);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error (e.g., show error message to user)
    }
  }

  useEffect(() => {
    fetchData();
    fetchNewestData();
  }, []);


  useEffect(() => {
    // Khởi tạo kết nối MQTT
    const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');
    client.on('connect', () => {
     
      client.subscribe('iot-1147707_nhom5/ws');
      console.log('Connected to MQTT over Ws broker');
    });
    client.on('message', (topic, message) => {
      console.log('Received message from MQTT broker');
      fetchData(); // Fetch new data when receiving message
      fetchNewestData();
    });

    return () => {
      client.end();
    };
  }, []); 

  // Extract data for charts
  const temps = historicHourlyData?.data?.map((item) => item.temp);
  const humidities = historicHourlyData?.data?.map((item) => item.humid);
  const times = historicHourlyData?.data?.map((item) => {
    const utcTime = new Date(item.time); // Tạo đối tượng Date từ thời gian UTC
    const vnTime = utcTime.toLocaleTimeString("en-US", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour12: false,
    }); // Chuyển sang múi giờ Việt Nam và không hiển thị AM/PM
    return vnTime.split(":").slice(0, 2).join(":"); // Lấy phần hh:mm
  });

  const aqi = historicHourlyData?.data?.map((item) => item.aqi);
  const ppm = historicHourlyData?.data?.map((item) => item.ppm<=500?item.ppm:500);

  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
  let weatherIcon, weatherClass;
  switch (newestData.weather) {
    case "Downpour":
      weatherIcon = (
        <TiWeatherDownpour
          size={30}
          className="weather-icon weather-downpour"
        />
      );
      weatherClass = "Downpour";
      break;
    case "PartlySunny":
      weatherIcon = (
        <TiWeatherPartlySunny
          size={30}
          className="weather-icon weather-partly-sunny"
        />
      );
      weatherClass = "PartlySunny";
      break;
    case "Shower":
      weatherIcon = (
        <TiWeatherShower size={30} className="weather-icon weather-shower" />
      );
      weatherClass = "Shower";
      break;
    case "Snow":
      weatherIcon = (
        <TiWeatherSnow size={30} className="weather-icon weather-snow" />
      );
      weatherClass = "Snow";
      break;
    case "Stormy":
      weatherIcon = (
        <TiWeatherStormy size={30} className="weather-icon weather-stormy" />
      );
      weatherClass = "Stormy";
      break;
    case "Sunny":
      weatherIcon = (
        <TiWeatherSunny size={30} className="weather-icon weather-sunny" />
      );
      weatherClass = "Sunny";
      break;
    default:
      weatherIcon = (
        <TiWeatherSunny size={30} className="weather-icon weather-sunny" />
      ); // Default to Sunny if weather is not recognized
      weatherClass = "Sunny";
      break;
  }

  return (
    <div>
      <h1>Details</h1>
      <div className="details">
        <div className="details-header inline">
          <p>To day is </p>
          <p>{formattedDate}</p>
          <p>Location:</p>
          <p>{newestData.location}</p>
        </div>

        <label>Current:</label>
        <div className="current-detail-info">
          <>
            <div className={"inline"}>
              <p>Weather:</p>
              <p className={weatherClass}>{weatherIcon}</p>
            </div>
            <div className={"inline"}>
              <p>Temperature:</p>
              <p
                className={`temperature ${
                  newestData.temp >= 35
                    ? "hot"
                    : newestData.temp >= 20
                    ? "moderate"
                    : "cool"
                }`}
              >
                {newestData.temp}°C
              </p>
            </div>

            <div className={"inline"}>
              <p>Humidity:</p>
              <p
                className={`humidity ${
                  newestData.humid >= 80
                    ? "high"
                    : newestData.humid >= 50
                    ? "moderate"
                    : "low"
                }`}
              >
                {newestData.humid}%
              </p>
            </div>
          </>
          <>
            <div className={"inline"}>
              <p>Air Quality Index:</p>
              <p
                className={`aqi ${
                  newestData.aqi > 300
                    ? "Hazardous"
                    : newestData.aqi > 200
                    ? "VeryBad"
                    : newestData.aqi > 150
                    ? "Bad"
                    : newestData.aqi > 100
                    ? "NotGood"
                    : newestData.aqi > 50
                    ? "Moderate"
                    : newestData.aqi > 0
                    ? "Good"
                    : ""
                }`}
              >
                {newestData.aqi}
              </p>
            </div>
            <div className={"inline"}>
              <p>CO Concentration:</p>
              <p
                className={`gas ${
                  newestData.ppm > 100
                    ? "high"
                    : newestData.ppm > 50
                    ? "moderate"
                    : "low"
                }`}
              >
                {newestData.ppm}
              </p>
              ppm
            </div>
          </>
        </div>

        <label>Historical:</label>
        <div className="inline">
          <button
            className={`btn-display ${displayHourly ? "display" : ""}`}
            onClick={() => handleDisplayHourly()}
          >
            Hourly
          </button>
          <button
            className={`btn-display ${displayDaily ? "display" : ""}`}
            onClick={() => handleDisplayDaily()}
          >
            Daily
          </button>
        </div>
        {displayHourly && (
          <>
            <div className="details-info">
              <div>
                <p>Temperature:</p>
                <DeviceWeatherInfo data={temps} header={"temp"} time={times} />
              </div>
              <div>
                <p>Humidity:</p>
                <DeviceWeatherInfo
                  data={humidities}
                  header={"humid"}
                  time={times}
                />
              </div>
            </div>

            <div className="details-info">
              <BarChart header={"aqi"} chartData={aqi} time={times} />
              <BarChart header={"ppm"} chartData={ppm} time={times} />
            </div>
          </>
        )}
        {displayDaily && (
          <div style={{height:"200px"}}>
            <br></br>
            Tính năng vẫn đang phát triển
          </div>
        )}
        <label>Forcast:</label>
        <div className="inline" style={{height:"200px"}}>
        <br></br>
        Tính năng đang phát triển  
      </div>
      </div>
    </div>
  );
};

export default Details;
