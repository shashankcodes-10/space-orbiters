// src/components/Launches.js
import React, { useState, useEffect } from 'react';
import { fetchUpcomingLaunches } from '../services/api';
import LaunchCard from './LaunchCard';

const Launches = ({ filterText }) => {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLaunchData = async () => {
      try {
        setLoading(true);
        const data = await fetchUpcomingLaunches();
        setLaunches(data.launches);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLaunchData();
  }, []);

  const filteredLaunches = launches.filter(launch =>
    launch.name.toLowerCase().includes(filterText.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      {filteredLaunches.length > 0 ? (
        filteredLaunches.map((launch) => <LaunchCard key={launch.id} launch={launch} />)
      ) : (
        <div>No launches match the filter criteria.</div>
      )}
    </div>
  );
};

export default Launches;
