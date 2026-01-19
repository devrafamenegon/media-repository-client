import { ReactionType } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/reactions/types`;

const getReactionTypes = async (): Promise<ReactionType[]> => {
  const res = await fetch(URL, { credentials: "include" });
  return res.json();
};

export default getReactionTypes;

