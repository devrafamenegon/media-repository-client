const URL = `${process.env.NEXT_PUBLIC_API_URL}/medias`;

import { fetchJson } from "./fetch-json";

const deleteMediaComment = async (
  mediaId: string,
  commentId: string,
  token?: string | null
): Promise<{ success: boolean }> => {
  return fetchJson<{ success: boolean }>(`${URL}/${mediaId}/comments/${commentId}`, {
    method: "DELETE",
    credentials: token ? "omit" : "include",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

export default deleteMediaComment;

