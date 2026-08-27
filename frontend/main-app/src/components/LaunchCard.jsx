import React from "react";

const LaunchCard = ({ launch }) => {
    return (
      <div className="bg-gray-700 text-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-bold">{launch.name}</h3>
        <p>Launch Window Start: {new Date(launch.windowstart).toLocaleString()}</p>
        <p>Location: {launch.location.name}</p>
      </div>
    );
  };
  
  export default LaunchCard;
  