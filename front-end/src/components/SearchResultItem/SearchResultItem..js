import React from "react";
import "./SearchResultItem.css";
import { Link } from "react-router-dom";
import {
  TiWeatherDownpour,
  TiWeatherPartlySunny,
  TiWeatherShower,
  TiWeatherSnow,
  TiWeatherStormy,
  TiWeatherSunny
} from "react-icons/ti";

const SearchResultItem = ({ item }) => {
  let aqiColorClass;
  if (item.aqi <= 50) {
    aqiColorClass = "Good";
  } else if (item.aqi <= 100) {
    aqiColorClass = "Moderate";
  } else {
    aqiColorClass = "Unhealthy";
  }
  return (
    <div className="search-result-item">
      <div className="info-header">
        <p>Location:</p>
        <p>{item.location}</p>
      </div>
      <div className="location-info">
        <p>Weather:</p>
        <div className="weather-info">
          {item.weather === "Downpour" && <TiWeatherDownpour size={30} className="weather-icon weather-downpour" />}
          {item.weather === "PartlySunny" && <TiWeatherPartlySunny size={30} className="weather-icon weather-partly" />}
          {item.weather === "Shower" && <TiWeatherShower size={30} className="weather-icon weather-shower" />}
          {item.weather === "Snow" && <TiWeatherSnow size={30} className="weather-icon weather-snow" />}
          {item.weather === "Stormy" && <TiWeatherStormy size={30} className="weather-icon weather-stormy" />}
          {item.weather === "Sunny" && <TiWeatherSunny size={30} className="weather-icon weather-sunny" />}
        </div>
        <p>Temperature:</p>
        <p
          className={`temperature ${
            item.temp >= 35 ? "hot" : item.temp >= 20 ? "moderate" : "cool"
          }`}
        >
          {item.temp}°C
        </p>
        <p>Humidity:</p>
        <p
          className={`humidity ${
            item.humid >= 80 ? "high" : item.humid >= 50 ? "moderate" : "low"
          }`}
        >
          {item.humid}%
        </p>
      </div>
      <div className="location-info">
        <p>Pollution level:</p>
        <p className={`${aqiColorClass}`}>{aqiColorClass}</p>
        <p>Air Quality Index:</p>
        <p className={`${aqiColorClass}`}>{item.aqi}</p>
        <p>Gas Concentration</p>
        <p
          className={`gas ${
            item.ppm >= 1000 ? "high" : item.ppm >= 400 ? "moderate" : "low"
          }`}
        >
          {item.ppm}
        </p>
      </div>
      <Link to={`/details?location=${item.location.replace(/,/g, "")}&id=${item.deviceId}`}>
        <button className="item-details">View Details</button>
      </Link>
    </div>
  );
  
};
export default SearchResultItem;
