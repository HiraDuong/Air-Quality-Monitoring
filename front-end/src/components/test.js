import { dataLocationItems } from "../data/data";
import DeviceWeatherInfo from "./DeviceWeatherInfo/DeviceWeatherInfo";
import LocationItem from "./LocationItem/LocationItem";
import SearchLocation from "./SearchLocation/SearchLocation";
import { useState } from "react";
import { dataLocation123 } from "../data/dataId123";

import Chart from "./Chart/BarChart";
import BarChart from "./Chart/BarChart";
const Test = () => {
  const [searchResult, setSearchResult] = useState([]);
    console.log("searchResult", searchResult);
    const temps = dataLocation123.map((item) => item.temp);
    const humidities = dataLocation123.map((item) => item.humid);
    const weather = dataLocation123.map((item) => item.weather);
    const times = dataLocation123.map((item) => item.time.split("T")[1]);
    const aqi = dataLocation123.map((item) => item.aqi);  
    const ppm = dataLocation123.map((item) => item.ppm);  
  return (<div style={{marginTop:"40px"}}>
    {/* <LocationItem location={dataLocationItems[0]} /> */}
    {/* <SearchLocation  data= {dataLocationItems} /> */}
     {/* <DeviceWeatherInfo data = {temps} header={"temp"}  time={times}/> */}
    {/* <DeviceWeatherInfo data = {humidities} header={"humid"} time={times}/>
    <DeviceWeatherInfo data = {weather} header={"weather"} time={times}/>  */}
    {/* <Graph header = {"aqi"} data = {temps} time={times}/>
    <Graph header = {"ppm"} data = {temps} time={times}/> */}
    <BarChart header = {"aqi"} chartData={aqi} time={times}/>  
    <BarChart header = {"ppm"} chartData={ppm} time={times}/>  

    </div>
  );
}
export default Test;