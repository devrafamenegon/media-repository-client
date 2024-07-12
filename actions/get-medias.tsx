import { Media } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/medias`;

const getMedias = async (): Promise<Media[]> => {
  const res = await fetch(URL);

  return res.json()
}

export default getMedias;