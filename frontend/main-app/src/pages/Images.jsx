// Images.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Images = () => {
  const [imageData, setImageData] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `https://api.nasa.gov/planetary/apod?api_key=Qh0n7HM3FhPnRrbzTd667aNDwe6ouabueKDTZ6j6&count=5`
        );
        setImageData(response.data);
      } catch (error) {
        console.error('Error fetching images:', error);
        
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="bg-black text-white p-8">
      <h1 className="text-6xl font-bold mb-6 text-center my-9">Planetary(Gallery) </h1>
      {imageData.map((item, index) => (
        <div key={item.date} className={`flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} mb-8`}>
          <div className="w-full md:w-1/2 mb-4 md:mb-0">
            <img src={item.url} alt={item.title} className="max-w-full h-auto rounded" />
          </div>
          <div className="w-full md:w-1/2 text-left">
            <h2 className="text-blue-500 text-2xl md:text-4xl font-bold mt-2">{item.title}</h2>
            <p className="text-white mb-2">{item.date}</p>
            <p className="text-white">{item.explanation}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Images;
