import { useState } from "react";
import { Typography, Card } from "@mui/material";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  zIndex: 100,
};

const ChatModal = ({ open, handleClose, name }) => {
  const planetsUrl = {
    VENUS: "https://www.chatbase.co/chatbot-iframe/d-1m-0X2TXJDO7gowHxUm",
    EARTH: "https://www.chatbase.co/chatbot-iframe/3n8ZyLfg63wLPUZjcEt8z",
    MARS: "https://www.chatbase.co/chatbot-iframe/W1NsfwsoMI4w_eu5KFWIT",
    MERCURY: "https://www.chatbase.co/chatbot-iframe/6px_NKibfdid-w4wlnqD_", 
    JUPITER: "https://www.chatbase.co/chatbot-iframe/6px_NKibfdid-w4wlnqD_",
    SATURN: "https://www.chatbase.co/chatbot-iframe/6px_NKibfdid-w4wlnqD_",
    URANUS: "https://www.chatbase.co/chatbot-iframe/6px_NKibfdid-w4wlnqD_",
    NEPTUNE: "https://www.chatbase.co/chatbot-iframe/6px_NKibfdid-w4wlnqD_",

  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ zIndex: 10000 }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          top: "50%",
          left: "20%",
          transform: "translate(-50%, -50%)",
          width: 400,
          border: "0.1px solid #000",
          boxShadow: 5,
          zIndex: 10000,
        }}
      >
        <Typography variant="h6" component="h2">
          Your {name} Chatbot
        </Typography>
        <iframe
          src={planetsUrl[name]}
          style={{
            height: "100%",
            minHeight: "400px",
            width: "100%",
            minWidth: "100px",
          }}
        ></iframe>
      </Card>
    </Modal>
  );
};

const PlanetChatModal = ({ name }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>Open {name} Chatbot</Button>
      <ChatModal open={open} handleClose={handleClose} name={name} />
    </div>
  );
};

export default PlanetChatModal;
