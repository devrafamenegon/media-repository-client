import { Media, Participant } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import GridCell from "../grid-cell";

interface MediaRowProps {
  medias: Media[] | [],
  loading: boolean,
  participants: Participant[] | []
}

const MediaChunkHorizontal: React.FC<MediaRowProps> = ({ 
  medias, 
  loading,
  participants 
}) => {
  return (
    <div className="flex flex-row h-full gap-4">
      {!loading ? (
        <>
          <div className="grid gap-4">
            <GridCell
              media={medias[0]}
              participant={participants.find((participant) => participant.id === medias[0]?.participantId)!}
            />
            <GridCell
              media={medias[1]}
              participant={participants.find((participant) => participant.id === medias[1]?.participantId)!}
            />
          </div>
          <div className="grid gap-4">
            <GridCell
              media={medias[2]}
              participant={participants.find((participant) => participant.id === medias[2]?.participantId)!}
            />
            <GridCell
              media={medias[3]}
              participant={participants.find((participant) => participant.id === medias[3]?.participantId)!}
            />
            <GridCell
              media={medias[4]}
              participant={participants.find((participant) => participant.id === medias[4]?.participantId)!}
            />
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <Skeleton
              className={'flex-1 h-1/2 aspect-video'}
            />
            <Skeleton
              className={'flex-1 h-1/2 aspect-video'}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Skeleton
              className={'flex-1 h-1/3 aspect-video'}
            />
            <Skeleton
              className={'flex-1 h-1/3 aspect-video'}
            />
            <Skeleton
              className={'flex-1 h-1/3 aspect-video'}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default MediaChunkHorizontal;
