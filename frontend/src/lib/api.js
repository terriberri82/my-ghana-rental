// In production, call our own domain (/api/...) and let Netlify forward it
// to Render. That keeps the login cookie first-party, so Safari accepts it.
// Locally, call the backend directly as before.
const BASE_URL = import.meta.env.PROD ? "" : import.meta.env.VITE_API_URL;

export async function api(path, options = {}) {
  const response = await fetch(`${BASE_URL}/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}
