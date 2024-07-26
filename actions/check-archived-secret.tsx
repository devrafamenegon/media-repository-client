const URL = `${process.env.NEXT_PUBLIC_API_URL}/medias/archived`;

const checkArchivedSecret = async (password: string): Promise<{ success: boolean }> => {
  const res = await fetch(URL, {
    method: 'POST',
    body: JSON.stringify({ password }),
  });

  return res.json()
}

export default checkArchivedSecret;