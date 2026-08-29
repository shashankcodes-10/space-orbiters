import { Box, Container, Grid, Typography } from "@mui/material";

const ProfileView = () => {
  // Dummy user data
  const user = {
    firstName: "Ansh",
    lastName: "johri",
    email: "anshjohri@gmail.com",
    
  };

  return (
    <>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Profile 👤
        </Typography>
      </Container>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item lg={4} md={6} xs={12}>
              {`Profile View for ${user.firstName} ${user.lastName}`}
            </Grid>
            <Grid item lg={8} md={6} xs={12}>
              {`Email: ${user.email}`}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default ProfileView;


