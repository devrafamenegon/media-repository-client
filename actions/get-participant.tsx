import { Participant } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/participants`;

const getParticipant = async (id: string): Promise<Participant> => {
  const res = await fetch(`${URL}/${id}`);

  return res.json()
}

export default getParticipant;