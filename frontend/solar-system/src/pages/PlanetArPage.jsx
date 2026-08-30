import { Helmet } from "react-helmet-async";
import PlanetArView from "../views/PlanetArView";

const PlanetArPage = () => {
  return (
    <>
      <Helmet>
        <title> Planet AR </title>
      </Helmet>

      <PlanetArView />
    </>
  );
};

export default PlanetArPage;
