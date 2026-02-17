export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost/api";

type ApiFetchOptions = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit;
};

export function apiFetch(path: string, options?: ApiFetchOptions) {
  const normalizedBase = API_BASE_URL.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return fetch(`${normalizedBase}${normalizedPath}`, {
    ...options,
    headers: {
      ...(options?.headers || {}),
    },
  });
}
