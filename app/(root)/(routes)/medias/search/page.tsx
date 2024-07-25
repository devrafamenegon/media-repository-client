'use client';

import getMedias from "@/actions/get-medias";
import getParticipants from "@/actions/get-participants";
import MediaGridVertical from "@/components/grids/vertical/media-grid-vertical";
import { ErrorModal } from "@/components/modals/error-modal";
import useMediaStore from "@/hooks/use-media-store";
import useParticipantStore from "@/hooks/use-participant-store";
import { Media } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const label = searchParams.get('label') || '';
  
  const { medias, setMedias } = useMediaStore();
  const { participants, setParticipants } = useParticipantStore();
  
  const [filteredMedias, setFilteredMedias] = useState<Media[]>();
  const [loading, setLoading] = useState(true);
  const [openErrorModal, setOpenErrorModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (label === 'genteboa') {
          router.push('/medias/archived');
        } else {
          router.push('/')
        }
        
        if (!medias.length) {
          const mediasData = await getMedias();
          setMedias(mediasData);
        }

        setFilteredMedias(medias.filter(media =>
          media.label.toLowerCase().includes(label.toLowerCase()) ||
          media.numericId.toString().includes(label.toLowerCase())
        ));

        if (!participants.length) {
          const participantsData = await getParticipants();
          setParticipants(participantsData);
        }
      } catch (error) {
        setOpenErrorModal(true);
        console.log('[SearchPage] - fetchData - error while fetching data', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [label]);

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
          medias={filteredMedias || []}
          participants={participants}
        />
      </div>
    </>
  );
}

export default SearchPage;