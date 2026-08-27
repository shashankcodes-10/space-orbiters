// src/components/SatelliteInfo.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SatelliteInfo = () => {
  const [donkiData, setDonkiData] = useState([]);
  const [expandedNotification, setExpandedNotification] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const donkiApiKey = 'Qh0n7HM3FhPnRrbzTd667aNDwe6ouabueKDTZ6j6';

        // Fetch DONKI data
        const donkiResponse = await axios.get(
          `https://api.nasa.gov/DONKI/notifications?startDate=2014-05-01&endDate=2014-05-08&type=all&api_key=${donkiApiKey}`
        );

        console.log('DONKI Data:', donkiResponse.data);
        setDonkiData(donkiResponse.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  const handleReadMore = (notification) => {
    setExpandedNotification(notification);
  };

  const handleReadLess = () => {
    setExpandedNotification(null);
  };

  return (
    <div>
      {/* Full-screen black background */}
      <div className="bg-black h-screen w-screen">
        {/* Your SatelliteInfo component */}
        <div className="mx-auto  bg-black p-8 text-white">
          <h1 className="text-6xl font-bold mb-4 text-center">Satellite Weather Notifications</h1>

          <div className="flex flex-wrap">
            {donkiData.map((notification) => (
              <div key={notification.messageID} className="w-full md:w-1/2 lg:w-1/4 m-14">
                <div className="bg-gray-800 p-4 rounded-md h-full">
                  <strong>{notification.messageType}</strong> -
                  {expandedNotification === notification ? (
                    <span>{notification.messageBody}</span>
                  ) : (
                    <span>{notification.messageBody.slice(0, 100)}...</span>
                  )}

                  {notification.messageBody.length > 100 && (
                    <div className="mt-2">
                      {expandedNotification === notification ? (
                        <button onClick={handleReadLess} className="text-blue-500 underline">
                          Read Less
                        </button>
                      ) : (
                        <button onClick={() => handleReadMore(notification)} className="text-blue-500 underline">
                          Read More
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SatelliteInfo;
