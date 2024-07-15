'use client';

import { useEffect, useState } from "react";
import MediaChunk from "./media-chunk";
import { Media } from "@/types";
import getMedias from "@/actions/get-medias";
import { ErrorModal } from "./modals/error-modal";

const MediaGrid = () => {
  const [medias, setMediasData] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [openErrorModal, setOpenErrorModal] = useState(false);

  const fetchData = async () => {
    try {
      const response = await getMedias();
      setMediasData(response);
    } catch (error) {
      setOpenErrorModal(true);
      console.log('[MediaGrid] - fetchData - error while fetching medias data', error);
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
          <MediaChunk key={index} medias={chunk} loading={loading} />
        ))) : (
          <MediaChunk medias={[]} loading={loading} />
        )}
      </div>
    </>
  )
}

export default MediaGrid;