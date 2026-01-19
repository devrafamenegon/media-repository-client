import { MediaComment } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/medias`;

const getMediaComments = async (mediaId: string): Promise<MediaComment[]> => {
  const res = await fetch(`${URL}/${mediaId}/comments`, { credentials: "include" });
  return res.json();
};

export default getMediaComments;

