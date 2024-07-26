"use client"

import getArchivedMedias from "@/actions/get-archived-medias";
import getParticipants from "@/actions/get-participants";
import MediaGridVertical from "@/components/grids/vertical/media-grid-vertical";
import { ErrorModal } from "@/components/modals/error-modal";
import useParticipantStore from "@/hooks/use-participant-store";
import useSecurityModal from "@/hooks/use-security-modal";
import { Media } from "@/types";
import { useEffect, useState } from "react";

export default function ArchivedPage() {
  const { participants, setParticipants } = useParticipantStore();

  const onOpen = useSecurityModal((state) => state.onOpen);
  const isOpen = useSecurityModal((state) => state.isOpen);
  const locked = useSecurityModal((state) => state.locked);

  const [loading, setLoading] = useState(true);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [archivedMedias, setArchivedMedias] = useState<Media[]>();

  useEffect(() => {
    if (!isOpen && locked) onOpen();

    if (!locked) {
      const fetchData = async () => {
        try { 
          if (!archivedMedias) {
            const mediasData = await getArchivedMedias();
            setArchivedMedias(mediasData);
          }

          if (!participants.length) {
            const participantsData = await getParticipants();
            setParticipants(participantsData);
          }
        } catch (error) {
          setOpenErrorModal(true);
          console.log('[ArchivedPage] - fetchData - error while fetching data', error);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }
  }, [isOpen, onOpen, locked]);

  return (
    <>
      <ErrorModal 
        isOpen={openErrorModal}
        onClose={() => window.location.reload()}
        loading={loading}
      />

      <div className="pt-16 p-2">
        {!locked && (
          <MediaGridVertical 
            loading={loading}
            medias={archivedMedias || []}
            participants={participants}
          />
        )}
      </div>
    </>
  );
}
