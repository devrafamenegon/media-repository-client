export class FetchJsonError extends Error {
  status: number;
  url: string;
  bodyText?: string;

  constructor(message: string, opts: { status: number; url: string; bodyText?: string }) {
    super(message);
    this.name = "FetchJsonError";
    this.status = opts.status;
    this.url = opts.url;
    this.bodyText = opts.bodyText;
  }
}

export async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : res.url;

  const text = await res.text().catch(() => "");
  let data: T = undefined as unknown as T;
  if (text) {
    try {
      data = JSON.parse(text) as T;
    } catch {
      // mantém data como undefined; em erros HTTP queremos reportar bodyText cru
    }
  }

  if (!res.ok) {
    throw new FetchJsonError(`HTTP ${res.status} for ${url}`, { status: res.status, url, bodyText: text });
  }

  return data;
}

