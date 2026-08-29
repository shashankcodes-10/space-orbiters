import React from 'react';

const EventDetail = ({ event }) => {
  if (!event) return null;

  return (
    <aside className="event-detail bg-white text-black p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{event.DATE}</h2>
      <img src={event.IMAGE_LINK} alt={`Event on ${event.DATE}`} className="w-full h-64 object-cover rounded-lg mb-4" />
      <h3 className="text-xl font-semibold mb-2">{event.COUNTRY}</h3>
      <p className="text-gray-700">{event.DESCRIPTION}</p>
    </aside>
  );
};

export default EventDetail;
