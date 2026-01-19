const URL = `${process.env.NEXT_PUBLIC_API_URL}/medias`;

export type MediaViewResponse = { viewCount: number };

const registerMediaView = async (mediaId: string): Promise<MediaViewResponse> => {
  const res = await fetch(`${URL}/${mediaId}/view`, {
    method: "POST",
    credentials: "include",
  });

  return res.json();
};

export default registerMediaView;

