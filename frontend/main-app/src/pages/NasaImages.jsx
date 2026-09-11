import { useState, useEffect } from "react";
import axios from "axios";
import galaxy from "../assets/galaxy.png";

const NasaImages = () => {
  const [images, setImages] = useState([]);
  const [visibleCount, setVisibleCount] = useState(25);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://images-api.nasa.gov/search",
          {
            params: {
              q: "earth",
              media_type: "image",
            },
          }
        );
        setImages(response.data.collection.items);
      } catch (error) {
        console.error("Error fetching data from NASA API:", error);
      }
    };

    fetchData();
  }, []);

  const loadMoreImages = () => {
    setVisibleCount((prevCount) => prevCount + 25);
  };

  const handleReadMore = (image) => {
    setSelectedImage(image);
  };

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        {images.slice(0, visibleCount).map((image, index) => (
          <div key={index} style={cardStyle}>
            <img
              src={image.links[0].href}
              alt={image.data[0].title}
              style={imageStyle}
            />

            <div style={textContainerStyle}>
              <h3 style={titleStyle}>{image.data[0].title}</h3>

              <button
                onClick={() => handleReadMore(image)}
                style={readMoreButtonStyle}
              >
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div style={fullDescriptionStyle}>
          <h2>{selectedImage.data[0].title}</h2>
          <p>{selectedImage.data[0].description}</p>

          <button
            onClick={() => setSelectedImage(null)}
            style={readMoreButtonStyle}
          >
            Close
          </button>
        </div>
      )}

      {visibleCount < images.length && (
        <button onClick={loadMoreImages} style={loadMoreButtonStyle}>
          Load More
        </button>
      )}
    </div>
  );
};

const imageStyle = {
  width: "100%",
  height: "250px",
  objectFit: "cover",
  borderTopLeftRadius: "0.5rem",
  borderTopRightRadius: "0.5rem",
};

const textContainerStyle = {
  padding: "1rem",
  textAlign: "left",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  color: "white",
  borderBottomLeftRadius: "0.5rem",
  borderBottomRightRadius: "0.5rem",
  height: "150px",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const containerStyle = {
  backgroundColor: "black",
  padding: "20px",
  minHeight: "100vh",
  backgroundImage: `url(${galaxy})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gridGap: "20px",
  marginBottom: "20px",
};

const cardStyle = {
  display: "block",
  width: "300px",
  backgroundColor: "#1f2937",
  border: "1px solid #374151",
  borderRadius: "0.5rem",
  boxShadow:
    "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  margin: "10px",
  overflow: "hidden",
  maxWidth: "500px",
  padding: "1.5rem",
  transition: "background-color 0.3s",
  textDecoration: "none",
  color: "white",
  cursor: "pointer",
};

cardStyle[":hover"] = {
  backgroundColor: "#374151",
};

const titleStyle = {
  marginBottom: "0.5rem",
  fontSize: "1.25rem",
  fontWeight: "bold",
  color: "white",
};

const loadMoreButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#1c6f42",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
  marginTop: "20px",
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
};

const readMoreButtonStyle = {
  backgroundColor: "#1c6f42",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "10px",
};

const fullDescriptionStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  color: "white",
  padding: "20px",
  margin: "20px 0",
  borderRadius: "10px",
};

export default NasaImages;