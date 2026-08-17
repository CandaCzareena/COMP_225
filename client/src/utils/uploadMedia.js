export async function uploadMedia(file) {
  const token = localStorage.getItem('coltcircle_token');
  const body = new FormData();
  body.append('file', file);

  const res = await fetch('/api/uploads', {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data;
}
