export async function apiRequest(
  url: string,
  options: RequestInit = {}
) {
  const res = await fetch(`http://localhost:3000${url}`, {
    ...options,
    credentials: "include", // 🔥 REQUIRED
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}
