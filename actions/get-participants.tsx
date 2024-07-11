import { Participant } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/participants`;

const getParticipants = async (): Promise<Participant[]> => {
  const res = await fetch(URL);

  return res.json()
}

export default getParticipants;