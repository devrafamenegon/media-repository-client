import qs from "query-string";

import { Media } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/medias/feed`;

export type MediaFeedResponse = {
  items: Media[];
  nextCursor: number | null;
};

export type GetMediaFeedParams = {
  seed: string;
  cursor?: number;
  take?: number;
  participantId?: string;
};

const getMediaFeed = async (params: GetMediaFeedParams): Promise<MediaFeedResponse> => {
  const url = qs.stringifyUrl({
    url: URL,
    query: {
      seed: params.seed,
      cursor: params.cursor ?? 0,
      take: params.take ?? 10,
      participantId: params.participantId,
    },
  });

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch media feed: ${res.status}`);
  }

  return res.json();
};

export default getMediaFeed;

