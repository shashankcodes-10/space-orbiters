import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Divider,
  Popover,
  MenuItem,
  IconButton,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

const MENU_OPTIONS = [
  {
    label: "Home",
    icon: "eva:home-fill",
    url: "/",
  },
  {
    label: "Profile",
    icon: "eva:person-fill",
    url: "/profile",
  },
  {
    label: "Settings",
    icon: "eva:settings-2-fill",
    url: "/settings",
  },
];

export default function AccountPopover() {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };
  const navigate = useNavigate();
  const account = {
    displayName: "Arn11old B.",
    email: "arnoldb@example.com",
    photoURL: "",
    role: "User",
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={account.photoURL}
          alt={account.displayName}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {account.photoURL ? "" : account.displayName?.[0]}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {account.displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {`${account.email}`}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem key={option.label} onClick={() => navigate(option.url)}>
            {option.label}
          </MenuItem>
        ))}

        <Divider sx={{ borderStyle: "dashed", m: 0 }} />

        <MenuItem disableRipple disableTouchRipple>
          <Button href={``} color="error">
            Logout
          </Button>
        </MenuItem>
      </Popover>
    </>
  );
}
