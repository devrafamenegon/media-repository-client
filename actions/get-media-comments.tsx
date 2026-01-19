import { MediaComment } from "@/types";
import { fetchJson } from "./fetch-json";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/medias`;

const getMediaComments = async (mediaId: string, token?: string | null): Promise<MediaComment[]> => {
  return fetchJson<MediaComment[]>(`${URL}/${mediaId}/comments`, {
    credentials: token ? "omit" : "include",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

export default getMediaComments;

