import React from 'react';
import './DeviceWeatherInfo.css';
import { TiWeatherDownpour, TiWeatherPartlySunny, TiWeatherShower, TiWeatherSnow, TiWeatherStormy, TiWeatherSunny } from 'react-icons/ti';

const DeviceWeatherInfo = ({ data, header, time }) => {

    const renderWeatherIcon = (weather) => {
        let weatherIcon;
        let weatherClass;

        switch (weather) {
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

        return (
            <div className={weatherClass}>
                {weatherIcon}
            </div>
        );
    };
    const renderTempData = (item)=>{    
      return( <div
       className={`temperature ${
        item >= 35 ? "hot" : item >= 20 ? "moderate" : "cool"
      }`}
        >{item}°C</div>)
    }
    const renderHumidData = (item)=>{
        return (<div
        className={`humidity ${
            item >= 80 ? "high" : item >= 50 ? "moderate" : "low"
          }`}
        >{item}%</div>)
    }
    const renderData = (dataSlice, timeSlice) => {
        return (
            <>
                <tr>
                    {timeSlice.map((item, index) => (
                        <th key={index}>{item}</th>
                    ))}
                </tr>
                <tr>
                    {dataSlice.map((item, index) => (
                        <td key={index}>
                            {header === "weather" ? renderWeatherIcon(item) : header === "temp" ? renderTempData(item) : renderHumidData(item)}
                        </td>
                    ))}
                </tr>
            </>
        );
    };

    const half = Math.ceil(time?.length / 2);
    if(data&&time)
    return (
        <>
        <div className='device-weather-info'>
            <table className='data-table'>
                <thead>
                    {renderData(data.slice(0, half), time.slice(0, half))}
                </thead>
                <tbody>
                    {renderData(data.slice(half), time.slice(half))}
                </tbody>
            </table>
        </div>
        </>
    );
    else return
};

export default DeviceWeatherInfo;
