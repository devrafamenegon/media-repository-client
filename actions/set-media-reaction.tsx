import { MediaReactionsResponse } from "./get-media-reactions";
import { fetchJson } from "./fetch-json";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/medias`;

const setMediaReaction = async (
  mediaId: string,
  reactionTypeId: string
): Promise<MediaReactionsResponse> => {
  return fetchJson<MediaReactionsResponse>(`${URL}/${mediaId}/reactions`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reactionTypeId }),
  });
};

export default setMediaReaction;

