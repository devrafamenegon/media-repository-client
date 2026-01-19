import { Media } from "@/types";

import { fetchJson } from "./fetch-json";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/medias`;

const getMedia = async (mediaId: string): Promise<Media> => {
  if (!mediaId) {
    throw new Error("mediaId is required");
  }

  return fetchJson<Media>(`${URL}/${mediaId}`);
};

export default getMedia;

