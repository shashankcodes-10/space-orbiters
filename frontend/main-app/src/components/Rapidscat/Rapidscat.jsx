import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

const Rapidscat = () => {
  const [picture, setPicture] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.nasa.gov/planetary/apod', {
          params: {
            api_key: 'Qh0n7HM3FhPnRrbzTd667aNDwe6ouabueKDTZ6j6' 
          }
        });
        setPicture(response.data);
      } catch (error) {
        console.error('Error fetching data from NASA APOD API:', error);
      }
    };

    fetchData();
  }, []);

  if (!picture) return <div>Loading...</div>;
  return (
    <>
      <section className="bg-primary text-white pb-12">
        <div className="container ">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div data-aos="">
            <img src={picture.url} alt={picture.title}  />
            </div>
            <div className="space-y-3 xl:pr-36 p-4  ">
              <p
                data-aos="fade-up"
                data-aos-delay="50"
                className="text-red-800 uppercase text-2xl"
              >
                Picture of the Day
              </p>
              
              <h3 
                data-aos="fade-up"
                data-aos-delay="50"
                className="uppercase text-3xl">{picture.title}</h3>
              <p data-aos="fade-up" data-aos-delay="50">
              <p >{picture.explanation}</p>
              </p>
              <Link to="/picture"> 
                <button
                  data-aos="fade-up"
                  data-aos-delay="50"
                  className="bg-red-300 text-white hover:bg-red-300 px-4 py-1 rounded-md duration-200"
                >
                  More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Rapidscat;
