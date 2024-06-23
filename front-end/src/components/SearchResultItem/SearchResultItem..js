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
  const formattedLocation = item?.location?.replace(/,/g, "");

  const formattedDeviceId = item.deviceId;
  let aqiColorClass;
  if (item.aqi <= 50) {
    aqiColorClass = "Good";
  } else if (item.aqi <= 100) {
    aqiColorClass = "NotGood";
  } else if (item.aqi <= 150) {
    aqiColorClass = "Bad";
  } else if (item.aqi <= 200) {
    aqiColorClass = "VeryBad";
  }
  else {
    aqiColorClass = "Hazardous";
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
        <p>CO Concentration</p>
        <p
          className={`gas ${
            item.ppm >= 100.0 ? "high" : item.ppm >= 50 ? "moderate" : "low"
          }`}
        >
          {item.ppm}
        </p>
      </div>
      <Link
        to={`/details?location=${formattedLocation}&id=${formattedDeviceId}`}
        state={{ location: item }}
        className="location-button"
      >
        View Details
      </Link>
    </div>
  );
  
};
export default SearchResultItem;
