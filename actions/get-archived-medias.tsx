import { Media } from "@/types";
import qs from "query-string";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/medias/archived`;

const getArchivedMedias = async (): Promise<Media[]> => {
  const url = qs.stringifyUrl({
    url: URL
  })

  const res = await fetch(url);

  return res.json()
}

export default getArchivedMedias;