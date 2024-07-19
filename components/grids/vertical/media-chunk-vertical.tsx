

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
  const mediaThumb = media.url.replace('.mp4', '.jpg');

  return (
    <div className={className}>
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
  loading 
}) => {
  return (
    <>
      {/* DESKTOP */}
      <div className="hidden sm:grid grid-cols-4 gap-2" style={{ gridTemplateRows: 'max(1fr, 194px)' }}>
        {!loading ? (
          medias.map((media, index) => (
            <GridCell
              key={index}
              media={media}
              className={gridTemplate[index]}
            />
          ))
        ) : (
          gridTemplate.map((style, index) => (
            <Skeleton key={index} className={`aspect-video ${style}`} />
          ))
        )}
      </div>
      
      {/* MOBILE */}
      <div className="grid sm:hidden grid-cols-2 gap-1">
        {!loading ? (
          medias.map((media, index) => (
            <GridCell
              key={index}
              media={media}
              className={gridTemplateMobile[index]}
            />
          ))
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
