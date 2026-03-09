import { ProgressCallback } from "./types";

export async function fetchBlob(url: string, callback?: ProgressCallback): Promise<Blob> {
  const res = await fetch(url)
  if (!res.ok) {
    let detail = '';
    try {
      detail = (await res.text()).trim();
    } catch {
      detail = '';
    }
    const suffix = detail ? `: ${detail.slice(0, 160)}` : '';
    throw new Error(`Could not fetch ${url} (${res.status} ${res.statusText})${suffix}`);
  }

  if (!res.body) {
    return await res.blob();
  }

  const reader = res.body.getReader();
  const contentLength = +(res.headers.get('Content-Length') ?? 0);

  let receivedLength = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    chunks.push(value);
    receivedLength += value.length;

    callback?.({
      url,
      total: contentLength,
      loaded: receivedLength,
    });
  }

  return new Blob(chunks, { type: res.headers.get('Content-Type') ?? undefined })
};
