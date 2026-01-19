const URL = `${process.env.NEXT_PUBLIC_API_URL}/medias`;

export type MediaReactionsResponse = {
  counts: Array<{ reactionTypeId: string; count: number }>;
  myReactionTypeIds: string[];
  topReactorsByType?: Record<string, { names: string[]; moreCount: number }>;
};

const getMediaReactions = async (mediaId: string): Promise<MediaReactionsResponse> => {
  const res = await fetch(`${URL}/${mediaId}/reactions`, { credentials: "include" });
  return res.json();
};

export default getMediaReactions;

