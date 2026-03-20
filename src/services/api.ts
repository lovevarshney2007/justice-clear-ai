const BASE_URL = "https://love-case-study-backend-2026.onrender.com/api/v1";
const USE_MOCK = false; // Toggle to false when backend is ready

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  mockResponse?: T,
  mockDelay = 1200
): Promise<T> {
  if (USE_MOCK && mockResponse !== undefined) {
    await new Promise((r) => setTimeout(r, mockDelay));
    return mockResponse;
  }

  const token = localStorage.getItem("jc_token");
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}
