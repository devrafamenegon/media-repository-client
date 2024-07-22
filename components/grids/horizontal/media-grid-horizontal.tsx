'use client';

import MediaChunkHorizontal from "./media-chunk-horizontal";
import { Media, Participant } from "@/types";
import { chunkMedias } from "@/lib/utils";
import { useState, useEffect } from "react";

interface MediaGridHorizontalProps {
  loading: boolean;
  participant: Participant | undefined;
  medias: Media[] | undefined;
}

const MediaGridHorizontal: React.FC<MediaGridHorizontalProps> = ({
  loading,
  participant,
  medias,
}) => {
  const [chunkedMedias, setChunkedMedias] = useState<Media[][]>([]);

  useEffect(() => {
    if (!loading && medias) {
      setChunkedMedias(chunkMedias(medias, 5));
    }
  }, [loading, medias]);

  return (
    <div className="flex flex-row h-full">
      <div className="flex gap-4">
        {!loading && chunkedMedias.length > 0 ? (
          chunkedMedias.map((chunk, index) => (
            <MediaChunkHorizontal
              key={index}
              loading={loading}
              participant={participant}
              medias={chunk}
            />
          ))
        ) : (
          <MediaChunkHorizontal
            loading={loading}
            participant={undefined}
            medias={undefined}
          />
        )}
      </div>
    </div>
  );
};

export default MediaGridHorizontal;
