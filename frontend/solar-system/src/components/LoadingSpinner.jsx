import { CircularProgress, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/system";
import PropTypes from "prop-types";

const LoadingSpinner = ({ label }) => {
  const theme = useTheme();

  return (
    <Stack
      sx={{
        color:
          theme.palette.mode === "light" ? "primary.main" : "primary.light",
        "& > :not(style)": { m: 1 },
      }}
      spacing={2}
      direction="row"
      alignItems="center"
    >
      <CircularProgress color="inherit" />
      <Typography variant="body1">
        {label ? `Loading ${label}...` : "Loading..."}
      </Typography>
    </Stack>
  );
};

LoadingSpinner.propTypes = {
  label: PropTypes.string,
};

export default LoadingSpinner;
