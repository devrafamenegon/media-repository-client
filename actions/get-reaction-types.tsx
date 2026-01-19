import { ReactionType } from "@/types";
import { fetchJson } from "./fetch-json";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/reactions/types`;

const getReactionTypes = async (): Promise<ReactionType[]> => {
  return fetchJson<ReactionType[]>(URL, { credentials: "include" });
};

export default getReactionTypes;

