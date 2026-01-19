import { MediaReactionsResponse } from "./get-media-reactions";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/medias`;

const setMediaReaction = async (
  mediaId: string,
  reactionTypeId: string
): Promise<MediaReactionsResponse> => {
  const res = await fetch(`${URL}/${mediaId}/reactions`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ reactionTypeId }),
  });

  return res.json();
};

export default setMediaReaction;

