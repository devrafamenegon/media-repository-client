'use client';

import { useEffect, useRef, useState } from "react";
import MediaChunkHorizontal from "./media-chunk-horizontal";
import { Media } from "@/types";
import getMedias from "@/actions/get-medias";
import { ErrorModal } from "@/components/modals/error-modal";
import { useScroll, useTransform } from "framer-motion";

interface MediaGridProps {
  participantId?: string,
}

const MediaGridHorizontal:React.FC<MediaGridProps> = ({
  participantId,
}) => {
  const [medias, setMediasData] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [openErrorModal, setOpenErrorModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMedias({ participantId });
        setMediasData(response);
      } catch (error) {
        setOpenErrorModal(true);
        console.log('[MediaGridHorizontal] - fetchData - error while fetching medias data', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [participantId]);

  const chunkArray = (array: Media[], size: number) => {
    const chunkedArr = [];
    for (let i = 0; i < array?.length; i += size) {
      chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
  }

  return (
    <div className="flex flex-row h-full">
      <ErrorModal 
        isOpen={openErrorModal}
        onClose={() => window.location.reload()}
        loading={loading}
      />
    
      <div className="flex gap-4">
        {!loading ? (chunkArray(medias, 5).map((chunk, index) => (
            <MediaChunkHorizontal key={index} medias={chunk} loading={loading} />
          ))) : (
            <MediaChunkHorizontal medias={[]} loading={loading} />
          )
        }
      </div>
    </div>
  )
}

export default MediaGridHorizontal;