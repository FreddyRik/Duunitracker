import { StorageError } from "@/lib/browser-storage";

const BASE64_CHUNK = 0x2000;

export async function blobToBase64(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  if (typeof btoa !== "function") {
    throw new StorageError("unavailable", "Base64 encoding is not available");
  }

  let binary = "";
  for (let index = 0; index < bytes.length; index += BASE64_CHUNK) {
    const chunk = bytes.subarray(index, index + BASE64_CHUNK);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

export function base64ToBlob(data: string, mimeType: string): Blob {
  if (typeof atob !== "function") {
    throw new StorageError("unavailable", "Base64 decoding is not available");
  }

  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: mimeType });
}
