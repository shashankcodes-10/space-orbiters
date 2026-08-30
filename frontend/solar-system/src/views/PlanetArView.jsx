import { Container, Typography } from "@mui/material";
import { PlanetAr } from "../components/planet-ar/PlanetAr";

const images = [
  // Front
  {
    position: [0, 0, 1.5],
    rotation: [0, 0, 0],
    url: "https://images-assets.nasa.gov/image/PIA02006/PIA02006~orig.jpg",
  },
  // Back
  {
    position: [-0.8, 0, -0.6],
    rotation: [0, 0, 0],
    url: "https://images-assets.nasa.gov/image/PIA10969/PIA10969~orig.jpg",
  },
  {
    position: [0.8, 0, -0.6],
    rotation: [0, 0, 0],
    url: "https://images-assets.nasa.gov/image/PIA10119/PIA10119~orig.jpg",
  },
  // Left
  {
    position: [-1.75, 0, 0.25],
    rotation: [0, Math.PI / 2.5, 0],
    url: "https://images-assets.nasa.gov/image/PIA11376/PIA11376~orig.jpg",
  },
  {
    position: [-2.15, 0, 1.5],
    rotation: [0, Math.PI / 2.5, 0],
    url: "https://images-assets.nasa.gov/image/EC05-0201-08/EC05-0201-08~orig.jpg",
  },
  {
    position: [-2, 0, 2.75],
    rotation: [0, Math.PI / 2.5, 0],
    url: "https://images-assets.nasa.gov/image/PIA22357/PIA22357~orig.jpg",
  },
  // Right
  {
    position: [1.75, 0, 0.25],
    rotation: [0, -Math.PI / 2.5, 0],
    url: "https://images-assets.nasa.gov/image/PIA03604/PIA03604~orig.jpg",
  },
  {
    position: [2.15, 0, 1.5],
    rotation: [0, -Math.PI / 2.5, 0],
    url: "https://images-assets.nasa.gov/image/PIA08003/PIA08003~orig.jpg",
  },
  {
    position: [2, 0, 2.75],
    rotation: [0, -Math.PI / 2.5, 0],
    url: "https://images-assets.nasa.gov/image/PIA09967/PIA09967~orig.jpg",
  },
];

const PlanetArView = () => {
  return (
    <>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Explore the Planet in AR 🌍
        </Typography>
      </Container>

      <PlanetAr images={images} />
    </>
  );
};

export default PlanetArView;
