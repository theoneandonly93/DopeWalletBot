async function getKey(password, salt) {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt","decrypt"]
  );
}
export async function encryptJson(password, data) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await getKey(password, salt);
  const enc = new TextEncoder().encode(JSON.stringify(data));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc));
  return btoa(JSON.stringify({ iv: Array.from(iv), salt: Array.from(salt), ct: Array.from(ct) }));
}
export async function decryptJson(password, blobB64) {
  const { iv, salt, ct } = JSON.parse(atob(blobB64));
  const key = await getKey(password, new Uint8Array(salt));
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: new Uint8Array(iv) }, key, new Uint8Array(ct));
  return JSON.parse(new TextDecoder().decode(new Uint8Array(pt)));
}
