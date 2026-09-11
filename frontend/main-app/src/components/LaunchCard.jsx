import PropTypes from "prop-types";

const LaunchCard = ({ launch }) => {
  return (
    <div className="bg-gray-700 text-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-bold">{launch.name}</h3>
      <p>
        Launch Window Start:{" "}
        {new Date(launch.windowstart).toLocaleString()}
      </p>
      <p>Location: {launch.location.name}</p>
    </div>
  );
};

LaunchCard.propTypes = {
  launch: PropTypes.shape({
    name: PropTypes.string.isRequired,
    windowstart: PropTypes.string.isRequired,
    location: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default LaunchCard;