// src/components/TimelineVisualization.js
import React from 'react';
import historicalEvents from '../data/historicalEvents.json';

const TimelineVisualization = ({ selectedYearRange, setSelectedEvent }) => {
  const filteredEvents = historicalEvents.filter(event => {
    const eventYear = new Date(event.DATE).getFullYear();
    return eventYear >= selectedYearRange[0] && eventYear <= selectedYearRange[1];
  });

  return (
    <div className="flex space-x-4 p-4">
      {filteredEvents.map(event => (
        <button
          key={event.DATE}
          className="event-dot bg-purple-600 hover:bg-purple-800 text-white font-semibold py-1 px-3 rounded shadow"
          onClick={() => setSelectedEvent(event)}
        >
          {new Date(event.DATE).toLocaleDateString()}
        </button>
      ))}
    </div>
  );
};

export default TimelineVisualization;
