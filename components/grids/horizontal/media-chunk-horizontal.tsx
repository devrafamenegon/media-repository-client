

import { Media } from "@/types";
import Image from "next/image";
import useMediaModal from "@/hooks/use-media-modal";
import { Skeleton } from "@/components/ui/skeleton";

interface MediaRowProps {
  medias: Media[] | [],
  loading: boolean
}

interface GridCellProps {
  media: Media;
  className?: string;
}

const GridCell: React.FC<GridCellProps> = ({ 
  media, 
  className 
}) => {
  const mediaModal = useMediaModal();

  if (!media) {
    return null;
  }
  
  const mediaThumb = media.url.replace('.mp4', '.jpg');

  return (
    <div className={`aspect-video ${className}`}>
      <Image
        width="1920"
        height="1080"
        src={mediaThumb}
        alt="Video thumb"
        className="cursor-pointer"
        onClick={() => mediaModal.onOpen(media)}
      />
    </div>
  )
}

const MediaChunkHorizontal: React.FC<MediaRowProps> = ({ 
  medias, 
  loading 
}) => {
  return (
    <div className="flex flex-row h-full gap-4">
      {!loading ? (
        <>
          <div className="flex flex-col gap-4">
            <GridCell
              media={medias[0]}
              className={'flex-1 h-1/2'}
            />
            <GridCell
              media={medias[1]}
              className={'flex-1 h-1/2'}
            />
          </div>
          <div className="flex flex-col gap-4">
            <GridCell
              media={medias[2]}
              className={'flex-1 h-1/3'}
            />
            <GridCell
              media={medias[3]}
              className={'flex-1 h-1/3'}
            />
            <GridCell
              media={medias[4]}
              className={'flex-1 h-1/3'}
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
