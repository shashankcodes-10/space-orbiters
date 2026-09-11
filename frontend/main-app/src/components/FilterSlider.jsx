import PropTypes from "prop-types";

const FilterSlider = ({ yearRange, setYearRange }) => {
  return (
    <div className="filter-slider my-10">
      <input
        type="range"
        min="1940"
        max="2021"
        value={yearRange[0]}
        onChange={(e) =>
          setYearRange([parseInt(e.target.value), yearRange[1]])
        }
        className="range range-primary"
      />
      <input
        type="range"
        min="1940"
        max="2021"
        value={yearRange[1]}
        onChange={(e) =>
          setYearRange([yearRange[0], parseInt(e.target.value)])
        }
        className="range range-primary"
      />
    </div>
  );
};

FilterSlider.propTypes = {
  yearRange: PropTypes.arrayOf(PropTypes.number).isRequired,
  setYearRange: PropTypes.func.isRequired,
};

export default FilterSlider;