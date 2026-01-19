const URL = `${process.env.NEXT_PUBLIC_API_URL}/medias`;

import { fetchJson } from "./fetch-json";

export type MediaReactionsResponse = {
  counts: Array<{ reactionTypeId: string; count: number }>;
  myReactionTypeIds: string[];
  topReactorsByType?: Record<string, { names: string[]; moreCount: number }>;
};

const getMediaReactions = async (mediaId: string): Promise<MediaReactionsResponse> => {
  return fetchJson<MediaReactionsResponse>(`${URL}/${mediaId}/reactions`, { credentials: "include" });
};

export default getMediaReactions;

