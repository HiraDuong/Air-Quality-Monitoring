import React, { useState } from "react";
import "./SearchLocation.css";
import SearchResultItem from "../SearchResultItem/SearchResultItem.";
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
const SearchLocation = ({ data }) => {
  const [location, setLocation] = useState("");
  const [display, setDisplay] = useState(false);
  const [result, setSearchResult] = useState([]);
  const handleSearch = (e) => {
    e.preventDefault();
    const searchResult = data.filter((item) =>
      item.location.toLowerCase().includes(location.toLowerCase())
    );
    setSearchResult(searchResult);
    setDisplay(true);
  };
  const handleOverlayClick = () => {
    setDisplay(false);
  };
  const handleCloseClick = () => {
    setDisplay(false);
  };
  return (
    <>
      <form className="search-location" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button type="submit">
          <FaSearch />
        </button>
      </form>
      {display && <div className="overlay" onClick={handleOverlayClick}></div>}
      {display && (
        <>
        <button className="close-button" onClick={handleCloseClick}>
        <IoClose size =  {40}/>
          </button>
        <div className="search-result">
          
          {result.map((item) => (
            <SearchResultItem key={item.location} item={item} />
          ))}
        </div>
        </>
      )}
    </>
  );
};

export default SearchLocation;
