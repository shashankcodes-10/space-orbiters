import { SvgIcon } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";

const icon = (muiIcon) => <SvgIcon component={muiIcon} />;

const navConfig = [
  {
    title: "Dashboard",
    path: "/",
    icon: icon(DashboardIcon),
  },
];

export default navConfig;
