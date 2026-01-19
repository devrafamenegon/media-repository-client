import { MediaComment } from "@/types";
import { fetchJson } from "./fetch-json";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/medias`;

const createMediaComment = async (
  mediaId: string,
  body: string,
  token?: string | null
): Promise<MediaComment> => {
  return fetchJson<MediaComment>(`${URL}/${mediaId}/comments`, {
    method: "POST",
    credentials: token ? "omit" : "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ body }),
  });
};

export default createMediaComment;

