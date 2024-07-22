'use client';

import { useEffect, useState } from "react";
import MediaChunkVertical from "./media-chunk-vertical";
import { Media, Participant } from "@/types";
import getMedias from "@/actions/get-medias";
import { ErrorModal } from "@/components/modals/error-modal";
import getParticipants from "@/actions/get-participants";

interface MediaGridProps {
  participantId?: string,
}

const MediaGridVertical:React.FC<MediaGridProps> = ({
  participantId,
}) => {
  const [medias, setMediasData] = useState<Media[]>([]);
  const [participants, setParticipantsData] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [openErrorModal, setOpenErrorModal] = useState(false);

  const fetchData = async () => {
    try {
      const medias = await getMedias({ participantId });
      setMediasData(medias);

      const participants = await getParticipants();
      setParticipantsData(participants);
    } catch (error) {
      setOpenErrorModal(true);
      console.log('[MediaGrid] - fetchData - error while fetching data', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const chunkArray = (array: Media[], size: number) => {
    const chunkedArr = [];
    for (let i = 0; i < array?.length; i += size) {
      chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
  }

  return (
    <>
      <ErrorModal 
        isOpen={openErrorModal}
        onClose={() => window.location.reload()}
        loading={loading}
      />
    
      <div className="flex flex-col gap-2">
        {!loading ? (chunkArray(medias, 21).map((chunk, index) => (
          <MediaChunkVertical key={index} medias={chunk} loading={loading} participants={participants}/>
        ))) : (
          <MediaChunkVertical medias={[]} loading={loading} participants={[]}/>
        )}
      </div>
    </>
  )
}

export default MediaGridVertical;