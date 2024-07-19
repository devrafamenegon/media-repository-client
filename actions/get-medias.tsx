import { Media } from "@/types";
import qs from "query-string";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/medias`;

interface Query {
  participantId?: string;
}

const getMedias = async (query: Query): Promise<Media[]> => {
  const url = qs.stringifyUrl({
    url: URL,
    query: {
      participantId: query.participantId,
    }
  })

  const res = await fetch(url);

  return res.json()
}

export default getMedias;