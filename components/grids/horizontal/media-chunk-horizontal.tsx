import { Media, Participant } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import GridCell from "../grid-cell";

interface MediaChunkHorizontalProps {
  loading: boolean,
  medias: Media[] | undefined,
  participant: Participant | undefined,
}

const MediaChunkHorizontal: React.FC<MediaChunkHorizontalProps> = ({ 
  loading,
  medias,
  participant 
}) => {
  return (
    <div className="flex flex-row h-full gap-4">
      {!loading && medias && participant ? (
        <>
          <div className="grid gap-4">
            <GridCell
              media={medias[0]}
              participant={participant}
            />
            <GridCell
              media={medias[1]}
              participant={participant}
            />
          </div>
          <div className="grid gap-4">
            <GridCell
              media={medias[2]}
              participant={participant}
            />
            <GridCell
              media={medias[3]}
              participant={participant}
            />
            <GridCell
              media={medias[4]}
              participant={participant}
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
