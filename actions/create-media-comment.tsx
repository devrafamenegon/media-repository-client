import { MediaComment } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/medias`;

const createMediaComment = async (mediaId: string, body: string): Promise<MediaComment> => {
  const res = await fetch(`${URL}/${mediaId}/comments`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ body }),
  });

  return res.json();
};

export default createMediaComment;

