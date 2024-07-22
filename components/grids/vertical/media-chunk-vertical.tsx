

import { Media, Participant } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import GridCell from "../grid-cell";

interface MediaRowProps {
  medias: Media[] | [],
  participants: Participant[] | [],
  loading: boolean
}

const gridTemplate = [
  "col-span-2 row-span-2",
  "col-start-3",
  "col-start-4",
  "col-start-3",
  "col-start-4",
  "col-start-1",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-span-2 row-span-2",
  "col-span-2 row-span-2",
  "col-start-1",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-1",
  "col-start-2",
  "col-span-2 row-span-2",
  "col-span-2 row-span-2",
  "col-start-3",
  "col-start-4",
];

const gridTemplateMobile = [
  "col-span-2 row-span-2",
  "col-start-1",
  "col-start-2",
  "col-start-1",
  "col-start-2",
  "col-span-2 row-span-2",
  "col-start-1",
  "col-start-2",
  "col-span-2 row-span-2",
  "col-span-2 row-span-2",
  "col-start-1",
  "col-start-2",
  "col-start-1",
  "col-start-2",
  "col-start-1",
  "col-start-2",
  "col-span-2 row-span-2",
  "col-span-2 row-span-2",
  "col-start-1",
  "col-start-2",
  "col-span-2 row-span-2",
];

const MediaChunkVertical: React.FC<MediaRowProps> = ({ 
  medias, 
  participants,
  loading 
}) => {
  return (
    <>
      {/* DESKTOP */}
      <div className="hidden sm:grid grid-cols-4 gap-2" style={{ gridTemplateRows: 'max(1fr, 194px)' }}>
        {!loading ? (
         medias.map((media, index) => {
            const participant = participants.find((participant) => participant.id === media.participantId);
            return ((media && participant) && (
                <GridCell
                  key={index}
                  media={media}
                  participant={participant}
                  className={gridTemplate[index]}
                />
              )
            )
          })
        ) : (
          gridTemplate.map((style, index) => (
            <Skeleton key={index} className={`aspect-video ${style}`} />
          ))
        )}
      </div>
      
      {/* MOBILE */}
      <div className="grid sm:hidden grid-cols-2 gap-1">
        {!loading ? (
          medias.map((media, index) => {
            const participant = participants.find((participant) => participant.id === media.participantId);
            return ((media && participant) && (
                <GridCell
                  key={index}
                  media={media}
                  participant={participant}
                  className={gridTemplateMobile[index]}
                />
              )
            )
          })
        ) : (
          gridTemplateMobile.map((style, index) => (
            <Skeleton key={index} className={`aspect-video ${style}`} />
          ))
        )}
      </div>
    </>
  );
}

export default MediaChunkVertical;
