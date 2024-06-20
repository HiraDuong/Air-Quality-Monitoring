import '../css/Details.css'
import React from 'react';
import { dataLocation123 } from '../data/dataId123';
const { useLocation } = require('react-router-dom');
const Details = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    // get data with id

    return (
      <div>
        <h1>Details</h1>
      </div>
    );
}
export default Details;