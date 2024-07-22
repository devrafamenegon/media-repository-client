'use client';

import MediaChunkVertical from "./media-chunk-vertical";
import { Media, Participant } from "@/types";
import { chunkMedias } from "@/lib/utils";

interface MediaGridProps {
  loading: boolean,
  medias: Media[],
  participants: Participant[],
}
const MediaGridVertical:React.FC<MediaGridProps> = ({

  medias,
  participants,
  loading
}) => {

  return (
    <div className="flex flex-col gap-2">
      {!loading ? (
        chunkMedias(medias, 21).map((chunk, index) => (
          <MediaChunkVertical 
            key={index} 
            loading={loading} 
            medias={chunk} 
            participants={participants}
          />
        ))
      ) : (
        <MediaChunkVertical 
          loading={loading} 
          medias={[]} 
          participants={[]}
        />
      )}
    </div>
  )
}

export default MediaGridVertical;