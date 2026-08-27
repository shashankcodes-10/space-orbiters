import React, { useState, useEffect } from 'react';
import axios from 'axios';
import background from '../assets/background.png';

const Picture = () => {
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
    <div style={containerStyle}>
      <h1 style={headingStyle}>Picture of the Day</h1>
      <div style={cardStyle}>
        <img src={picture.url} alt={picture.title} style={imageStyle} />
        <div style={textContainerStyle}>
          <h3 style={titleStyle}>{picture.title}</h3>
          <p style={textStyle}>{picture.explanation}</p>
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
    backgroundColor: 'black',
    color: 'white',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundImage: `url(${background})`, // Use the imported variable here
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

const cardStyle = {
  backgroundColor: '#1f2937', // Dark background
  border: '1px solid #374151', // Border color
  borderRadius: '0.5rem',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  width: '80%', // Adjust as needed
  maxWidth: '500px', // Adjust as needed
  textAlign: 'center',
  overflow: 'hidden',
};

const imageStyle = {
  width: '500px',
  height: '500px',
  borderRadius: '0.5rem 0.5rem 0 0',
};

const textContainerStyle = {
  padding: '1.5rem',
};

const headingStyle = {
  fontSize: '2.5rem',
  marginBottom: '1rem',
};

const titleStyle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
};

const textStyle = {
  fontSize: '1rem',
};

export default Picture;
