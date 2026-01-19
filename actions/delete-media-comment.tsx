const URL = `${process.env.NEXT_PUBLIC_API_URL}/medias`;

const deleteMediaComment = async (mediaId: string, commentId: string): Promise<{ success: boolean }> => {
  const res = await fetch(`${URL}/${mediaId}/comments/${commentId}`, {
    method: "DELETE",
    credentials: "include",
  });

  return res.json();
};

export default deleteMediaComment;

