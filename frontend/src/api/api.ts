const API_URL = "http://localhost:8000/api";

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  token: string;
}

export async function registerUser(user: { username: string; email: string; password: string }) {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Помилка реєстрації");
  }

  return res.json(); // очікуємо { token: "..." }
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export async function loginUser(data: LoginData): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(data as any)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Login failed");
  }

  return res.json();
}

export async function getUsersAPI(token: string) {
  const res = await fetch("http://localhost:8000/api/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function getMessagesAPI(token: string) {
  const res = await fetch(`${API_URL}/messages`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return res.json();
}

export async function sendMessageAPI(content: string, files: File[], token: string) {
  const formData = new FormData();
  formData.append("content", content);
  files.forEach(f => formData.append("files", f));

  const res = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
    body: formData
  });
  return res.json();
}

export async function editMessageAPI(id: number, content: string, files: File[], token: string) {
  const formData = new FormData();
  formData.append("content", content);
  files.forEach(f => formData.append("files", f));

  await fetch(`${API_URL}/messages/${id}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}` },
    body: formData
  });
}

export async function deleteMessageAPI(id: number, token: string) {
  await fetch(`${API_URL}/messages/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
}
