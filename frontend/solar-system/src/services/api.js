const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function fetchPlanets() {
  const response = await fetch(`${API_BASE_URL}/planets`);
  if (!response.ok) throw new Error("Failed to fetch planets");
  return response.json();
}
