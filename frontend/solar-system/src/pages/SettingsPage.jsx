import { Helmet } from "react-helmet-async";
import SettingsView from "../views/SettingsView";

const RoadmapsPage = () => {
  return (
    <>
      <Helmet>
        <title> Settings </title>
      </Helmet>

      <SettingsView />
    </>
  );
};

export default RoadmapsPage;
