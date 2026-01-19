import { fetchJson } from "./fetch-json";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/exchange`;

type ExchangeResponse = { token: string; expiresAt: number };

let cached: { token: string; expiresAt: number } | null = null;

export async function exchangeAdminToken(clerkToken: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  // Reusa token se ainda estiver válido com folga.
  if (cached && cached.expiresAt - 30 > now) {
    return cached.token;
  }

  const res = await fetchJson<ExchangeResponse>(URL, {
    method: "POST",
    credentials: "omit",
    headers: {
      Authorization: `Bearer ${clerkToken}`,
    },
  });

  cached = res;
  return res.token;
}

