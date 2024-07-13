import { CldVideoPlayer } from "next-cloudinary";
import 'next-cloudinary/dist/cld-video-player.css';

import { Media } from "@/types";
import { Skeleton } from "./ui/skeleton";

interface MediaRowProps {
  medias: Media[] | [],
  loading: boolean
}

interface VideoPlayerProps {
  url: string;
}

interface GridCellProps {
  url: string;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  url 
}) => (
  <CldVideoPlayer 
    width="1920" 
    height="1080" 
    src={url}
    bigPlayButton={false} 
    poster={ { src: "", crop: "fill" } } // NÂO REMOVER, MELHORA A QUALIDADE DA THUMB
    logo={false}
  />
);

const GridCell: React.FC<GridCellProps> = ({ 
  url, 
  className 
}) => (
  <div className={className}>
    <VideoPlayer url={url} />
  </div>
);

const gridTemplate = [
  "col-span-2 row-span-2",
  "col-start-3",
  "col-start-4",
  "col-start-3 row-start-2",
  "col-start-4 row-start-2",
  "row-start-3",
  "row-start-3",
  "row-start-3",
  "row-start-3",
  "col-span-2 row-span-2 row-start-4",
  "col-span-2 row-span-2 col-start-3",
  "row-start-6",
  "row-start-6",
  "row-start-6",
  "row-start-6",
  "row-start-7",
  "col-start-2 row-start-7",
  "col-span-2 row-span-2 col-start-1 row-start-8",
  "col-span-2 row-span-2 col-start-3 row-start-7",
  "col-start-3 row-start-9",
  "col-start-4 row-start-9",
]

const MediaRow: React.FC<MediaRowProps> = ({ 
  medias, 
  loading 
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 sm:gap-2" style={{ gridTemplateRows: 'repeat(9, max(1fr, 194px))' }}>
      {!loading ? (
        medias.map((media, index) => (
          <GridCell
            key={index}
            url={media.url}
            className={gridTemplate[index]}
          />
        ))
      ) : (
        gridTemplate.map((style, index) => (
          <Skeleton key={index} className={`aspect-video ${style}`} />
        ))
      )}
    </div>
  );
}

export default MediaRow;
