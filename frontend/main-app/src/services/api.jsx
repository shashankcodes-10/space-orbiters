const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const fetchUpcomingLaunches = async () => {
  const response = await fetch(`${API_BASE_URL}/launches`);
  if (!response.ok) throw new Error("Failed to fetch upcoming launches");
  return response.json();
};

const fetchPlanets = async () => {
  const response = await fetch(`${API_BASE_URL}/planets`);
  if (!response.ok) throw new Error("Failed to fetch planets");
  return response.json();
};

export { fetchUpcomingLaunches, fetchPlanets };
