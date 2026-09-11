import PropTypes from "prop-types";

const Filter = ({ onFilterChange }) => {
  return (
    <div className="mb-4">
      <label
        htmlFor="filter"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
      >
        Filter launches:
      </label>
      <input
        type="text"
        id="filter"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder="Type to filter..."
        onChange={onFilterChange}
      />
    </div>
  );
};

Filter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default Filter;