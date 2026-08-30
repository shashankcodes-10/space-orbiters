import { Container, Typography } from "@mui/material";
import SolarSystem from "../components/solar-system/SolarSystem";

const IndexView = () => {
  return (
    <>
      <Container maxWidth="x">
        <Typography variant="h6 color-white" sx={{ mb: 5 }}>
          Hello 👋 Welcome to Our solar system
        </Typography>
      </Container>

      <SolarSystem />
    </>
  );
};

export default IndexView;
