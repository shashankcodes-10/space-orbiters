import {
  Backdrop,
  Modal,
  Fade,
  Button,
  Typography,
  Card,
  CardHeader,
  CardActions,
  CardContent,
} from "@mui/material";
import PropTypes from "prop-types";
import PlanetChatModal from "./PlanetChatModal";
import { Link } from "react-router-dom";

const DialogModal = ({ openDialog, handleCloseDialog, dialogData }) => {
  const { name, gravity, orbitalPeriod, surfaceArea } = dialogData || {};

  return (
    <Modal
      open={openDialog}
      onClose={handleCloseDialog}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 100,
        },
      }}
    >
      <Fade in={openDialog} easing={"ease-in-out"}>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "transparent",
            position: "absolute",
            top: "20%",
            left: "85%",
            transform: "translate(-50%, -50%)",
            width: 400,
            border: "0.1px solid #000",
            boxShadow: 5,
            zIndex: 10000,
          }}
        >
          <CardHeader
            title={`Explore ${name}!`}
            sx={{
              color: "white",
            }}
          />
          <CardContent
            sx={{
              color: "gray",
              p: 2,
            }}
          >
            <Typography variant="body2">Gravity: {gravity} m/s²</Typography>
            <Typography variant="body2">
              Orbital period: {orbitalPeriod} days
            </Typography>
            <Typography variant="body2">
              Surface area: {surfaceArea} million km²
            </Typography>
          </CardContent>
          <CardActions>
            <PlanetChatModal name={name} />
            <Link to="/planet-ar" style={{ textDecoration: "none" }}>
              <Button>Explore AR</Button>
            </Link>
          </CardActions>
        </Card>
      </Fade>
    </Modal>
  );
};

DialogModal.propTypes = {
  openDialog: PropTypes.bool.isRequired,
  handleCloseDialog: PropTypes.func.isRequired,
  dialogData: PropTypes.shape({
    name: PropTypes.string,
    gravity: PropTypes.string,
    orbitalPeriod: PropTypes.string,
    surfaceArea: PropTypes.string,
  }),
};

export default DialogModal;
