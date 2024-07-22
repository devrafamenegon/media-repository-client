'use client';

import getMedias from "@/actions/get-medias";
import getParticipants from "@/actions/get-participants";
import MediaGridVertical from "@/components/grids/vertical/media-grid-vertical";
import { ErrorModal } from "@/components/modals/error-modal";
import useMediaStore from "@/hooks/use-media-store";
import useParticipantStore from "@/hooks/use-participant-store";
import { useEffect, useState } from "react";

const HomePage = () => {
  const { medias, setMedias } = useMediaStore();
  const { participants, setParticipants } = useParticipantStore();

  const [loading, setLoading] = useState(true);
  const [openErrorModal, setOpenErrorModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!medias.length) {
          const mediasData = await getMedias();
          setMedias(mediasData);
        }

        if (!participants.length) {
          const participantsData = await getParticipants();
          setParticipants(participantsData);
        }
      } catch (error) {
        setOpenErrorModal(true);
        console.log('[Home] - fetchData - error while fetching data', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <ErrorModal 
        isOpen={openErrorModal}
        onClose={() => window.location.reload()}
        loading={loading}
      />

      <div className="pt-16 p-2">
        <MediaGridVertical 
          loading={loading}
          medias={medias}
          participants={participants}
        />
      </div>
    </>
  );
}

export default HomePage;