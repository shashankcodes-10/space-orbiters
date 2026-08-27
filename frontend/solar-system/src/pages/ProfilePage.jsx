import { Helmet } from "react-helmet-async";
import ProfileView from "../views/ProfileView";

const IndexPage = () => {
  return (
    <>
      <Helmet>
        <title> Profile </title>
      </Helmet>

      <ProfileView />
    </>
  );
};

export default IndexPage;
