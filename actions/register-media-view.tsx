const URL = `${process.env.NEXT_PUBLIC_API_URL}/medias`;

export type MediaViewResponse = { viewCount: number };

import { fetchJson } from "./fetch-json";

const registerMediaView = async (mediaId: string, token?: string | null): Promise<MediaViewResponse> => {
  return fetchJson<MediaViewResponse>(`${URL}/${mediaId}/view`, {
    method: "POST",
    credentials: token ? "omit" : "include",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

export default registerMediaView;

