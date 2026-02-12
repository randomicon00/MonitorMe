export async function fetchFromAPI(url: string, token?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  const resp = await response.json();

  return resp;
}

export function handleError(res: any, err: any) {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
}
