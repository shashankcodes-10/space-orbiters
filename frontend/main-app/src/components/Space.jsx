import React, {useState} from 'react'
import Launches from './Launches.jsx'
import Filter from './Filter';


const Space = () => {
  const [filterText, setFilterText] = useState('');

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold underline text-center mb-4">
        Upcoming Space Launches
      </h1>
      <Filter onFilterChange={handleFilterChange} />
      <Launches filterText={filterText} />
    </div>
  )
}

export default Space
