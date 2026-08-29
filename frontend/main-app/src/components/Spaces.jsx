import React, { useState } from 'react';
import TimelineVisualization from './TimelineVisualization';
import EventDetail from './EventDetail';
import FilterSlider from './FilterSlider';

const Spaces = () => {
  const [selectedYearRange, setSelectedYearRange] = useState([1940, 2021]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className="app bg-black min-h-screen p-5 flex flex-col">
      <h1 className="text-3xl text-white font-bold text-center mb-10">Space Exploration History</h1>
      <FilterSlider yearRange={selectedYearRange} setYearRange={setSelectedYearRange} />
      <TimelineVisualization selectedYearRange={selectedYearRange} setSelectedEvent={setSelectedEvent} />
      {selectedEvent && (
        <div className="event-details-container mt-6 justify-center" style={{ width: '600px', height: '1200px' }}>
          <EventDetail event={selectedEvent} />
        </div>
      )}
    </div>
  );
};

export default Spaces;
