const API_URL = "http://localhost:8000/api";

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
