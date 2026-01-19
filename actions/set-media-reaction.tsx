import { MediaReactionsResponse } from "./get-media-reactions";
import { fetchJson } from "./fetch-json";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/medias`;

const setMediaReaction = async (
  mediaId: string,
  reactionTypeId: string,
  token?: string | null
): Promise<MediaReactionsResponse> => {
  return fetchJson<MediaReactionsResponse>(`${URL}/${mediaId}/reactions`, {
    method: "POST",
    credentials: token ? "omit" : "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ reactionTypeId }),
  });
};

export default setMediaReaction;

