import { MediaComment } from "@/types";
import { fetchJson } from "./fetch-json";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/medias`;

const getMediaComments = async (mediaId: string): Promise<MediaComment[]> => {
  return fetchJson<MediaComment[]>(`${URL}/${mediaId}/comments`, { credentials: "include" });
};

export default getMediaComments;

