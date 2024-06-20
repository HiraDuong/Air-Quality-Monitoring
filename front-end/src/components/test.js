import { dataLocationItems } from "../data/data";
import DeviceWeatherInfo from "./DeviceWeatherInfo/DeviceWeatherInfo";
import LocationItem from "./LocationItem/LocationItem";
import SearchLocation from "./SearchLocation/SearchLocation";
import { useState } from "react";
import { dataLocation123 } from "../data/dataId123";
const Test = () => {
  const [searchResult, setSearchResult] = useState([]);
    console.log("searchResult", searchResult);
    const temps = dataLocation123.map((item) => item.temp);
    const humidities = dataLocation123.map((item) => item.humid);
    const weather = dataLocation123.map((item) => item.weather);
    const times = dataLocation123.map((item) => item.time.split("T")[1]);
  return (<div style={{marginTop:"40px"}}>
    {/* <LocationItem location={dataLocationItems[0]} /> */}
    {/* <SearchLocation  data= {dataLocationItems} /> */}
    <DeviceWeatherInfo data = {temps} header={"temp"}  time={times}/>
    <DeviceWeatherInfo data = {humidities} header={"humid"} time={times}/>
    <DeviceWeatherInfo data = {weather} header={"weather"} time={times}/>
    </div>
  );
}
export default Test;