const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data as T;
}


export const register = (body: {
  name: string;
  email: string;
  password: string;
}) => request<{ message: string }>("/user/create", { method: "POST", body: JSON.stringify(body) });

export const login = (body: { email: string; password: string }) =>
  request<{ message: string; token: string; user: User }>("/user/login", {
    method: "POST",
    body: JSON.stringify(body),
  });


export const getFavourites = () =>
  request<{ favourites: Favourite[] }>("/favourite/my");

export const addFavourite = (propertyId: string) =>
  request<{ message: string; favourite: Favourite }>("/favourite/add", {
    method: "POST",
    body: JSON.stringify({ propertyId }),
  });

export const removeFavourite = (propertyId: string) =>
  request<{ message: string }>(`/favourite/remove/${propertyId}`, {
    method: "DELETE",
  });


export interface User {
  _id: string;
  name: string;
  email: string;
  role: "buyer" | "admin";
  createdAt: string;
}

export interface Favourite {
  _id: string;
  user: string;
  propertyId: string;
  createdAt: string;
}