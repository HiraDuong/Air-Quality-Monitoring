import React from "react";
import "./LocationItem.css";
import { Link } from "react-router-dom";
import { TiWeatherDownpour, TiWeatherPartlySunny, TiWeatherShower, TiWeatherSnow, TiWeatherStormy, TiWeatherSunny } from 'react-icons/ti';

const LocationItem = ({ location }) => {
  let weatherIcon;
  let weatherClass;
  const formattedLocation = location?.location?.replace(/,/g, "");

  const formattedDeviceId = location.deviceId;
  
  // Determine weather icon and class based on location.weather
  switch (location.weather) {
    case "Downpour":
      weatherIcon = <TiWeatherDownpour size={30} className="weather-icon weather-downpour" />;
      weatherClass = "Downpour";
      break;
    case "PartlySunny":
      weatherIcon = <TiWeatherPartlySunny size={30} className="weather-icon weather-partly-sunny" />;
      weatherClass = "PartlySunny";
      break;
    case "Shower":
      weatherIcon = <TiWeatherShower size={30} className="weather-icon weather-shower" />;
      weatherClass = "Shower";
      break;
    case "Snow":
      weatherIcon = <TiWeatherSnow size={30} className="weather-icon weather-snow" />;
      weatherClass = "Snow";
      break;
    case "Stormy":
      weatherIcon = <TiWeatherStormy size={30} className="weather-icon weather-stormy" />;
      weatherClass = "Stormy";
      break;
    case "Sunny":
      weatherIcon = <TiWeatherSunny size={30} className="weather-icon weather-sunny" />;
      weatherClass = "Sunny";
      break;
    default:
      weatherIcon = <TiWeatherSunny size={30} className="weather-icon weather-sunny" />; // Default to Sunny if weather is not recognized
      weatherClass = "Sunny";
      break;
  }

  let aqiColorClass;

  // Determine AQI color class based on value
  if (location.aqi <= 50) {
    aqiColorClass = "Good";
  } else if (location.aqi <= 100) {
    aqiColorClass = "Moderate";
  } else if (location.aqi <= 150) {
    aqiColorClass = "NotGood";
  } else if (location.aqi <= 200) {     
    aqiColorClass = "Bad";
  } else if (location.aqi <= 300) {
    aqiColorClass = "VeryBad";
  }
  else {
    aqiColorClass = "Hazardous";
  }

  return (
    <div className="location-item">
      <div className="info-header">
        <p>Location:</p>
        <p>{location.location}</p>
      </div>
      <div className="location-info">
        <p>Weather:</p>
        <div className={`weather-icon ${weatherClass}`}>
          {weatherIcon}
        </div>
        <p>Temperature:</p>
        <p
          className={`temperature ${
            location.temp >= 35
              ? "hot"
              : location.temp >= 20
              ? "moderate"
              : "cool"
          }`}
        >
          {location.temp}°C
        </p>
        <p>Humidity:</p>
        <p
          className={`humidity ${
            location.humid >= 80
              ? "high"
              : location.humid >= 50
              ? "moderate"
              : "low"
          }`}
        >
          {location.humid}%
        </p>
      </div>
      <div className={`location-info`}>
        <p>Pollution level:</p>
        <p className={`${aqiColorClass}`}>{aqiColorClass}</p>
        <p>Air Quality Index:</p>
        <p className={`${aqiColorClass}`}>{location.aqi}</p>
      </div>
      <div className="location-info">
        <p>CO Concentration:</p>
        <p
          className={`gas ${
            location.ppm > 100.0
              ? "high"
              : location.ppm > 50.0
              ? "moderate"
              : "low"
          }`}
        >
          {location.ppm}
        </p>
        ppm
      </div>
      <Link
        to={`/details?location=${formattedLocation}&id=${formattedDeviceId}`}
        state={{ location: location }}
        className="location-button"
      >
        View Details
      </Link>
    </div>
  );
};

export default LocationItem;
