const apiURL =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "http://localhost:3000/api" : "");

if (!apiURL) {
  console.error(
    "VITE_API_URL no está definida. Crea frontend/.env con VITE_API_URL=http://localhost:3000/api",
  );
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new ApiError(
      response.status,
      (data as { message?: string })?.message ?? response.statusText,
      data,
    );
  }

  return data as T;
}

function buildHeaders(token?: string | null): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json; charset=UTF-8",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function apiRequest<T>(
  path: string,
  { method = "GET", body, token }: RequestOptions = {},
): Promise<T> {
  const response = await fetch(`${apiURL}${path}`, {
    method,
    headers: buildHeaders(token),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  return parseResponse<T>(response);
}

export const api = {
  get: <T>(path: string, token?: string | null) =>
    apiRequest<T>(path, { method: "GET", token }),
  post: <T>(path: string, body: unknown, token?: string | null) =>
    apiRequest<T>(path, { method: "POST", body, token }),
  put: <T>(path: string, body: unknown, token?: string | null) =>
    apiRequest<T>(path, { method: "PUT", body, token }),
  delete: <T>(path: string, token?: string | null) =>
    apiRequest<T>(path, { method: "DELETE", token }),
};

export { apiURL };
