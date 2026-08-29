import { Container, Typography, Box, Button } from "@mui/material";

const SettingsView = () => {
  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" gutterBottom>
          This is the settings view. More content will be added here later.
        </Typography>
        <Button variant="contained" color="primary">
          Do nothing 😇
        </Button>
      </Box>
    </Container>
  );
};

export default SettingsView;
