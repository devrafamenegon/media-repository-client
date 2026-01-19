const URL = `${process.env.NEXT_PUBLIC_API_URL}/medias`;

import { fetchJson } from "./fetch-json";

export type MediaReactionsResponse = {
  counts: Array<{ reactionTypeId: string; count: number }>;
  myReactionTypeIds: string[];
  topReactorsByType?: Record<string, { names: string[]; moreCount: number }>;
};

const getMediaReactions = async (
  mediaId: string,
  token?: string | null
): Promise<MediaReactionsResponse> => {
  return fetchJson<MediaReactionsResponse>(`${URL}/${mediaId}/reactions`, {
    credentials: token ? "omit" : "include",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

export default getMediaReactions;

