import PropTypes from "prop-types";
import { forwardRef } from "react";

import { Link, Box } from "@mui/material";
import RouterLink from "./RouterLink";
import { useTheme } from "@mui/material/styles";
import LogoNoBackground from "/logo/png/logo-no-background.png";

// eslint-disable-next-line react/display-name
const Logo = forwardRef(({ disabledLink = false, sx }, ref) => {
  const theme = useTheme();

  const logo = (
    <Box
      ref={ref}
      component="img"
      src={LogoNoBackground}
      sx={{
        cursor: "pointer",
        ...sx,
        width: theme.spacing(10),
      }}
    />
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: "contents" }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
