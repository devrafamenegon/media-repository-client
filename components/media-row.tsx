'use client';

import { Media } from "@/types";
import { CldVideoPlayer } from "next-cloudinary";
import 'next-cloudinary/dist/cld-video-player.css';
import { useEffect, useState } from "react";

interface MediaRowProps {
  medias: Media[]
}

interface VideoPlayerProps {
  url: string;
}

interface GridCellProps {
  url: string;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => (
  <CldVideoPlayer 
    width="1920" 
    height="1080" 
    src={url} 
    bigPlayButton={false} 
  />
);

const GridCell: React.FC<GridCellProps> = ({ url, className }) => (
  <div className={className}>
    <VideoPlayer url={url} />
  </div>
);

const MediaRow: React.FC<MediaRowProps> = ({ medias }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true)
  }, []);

  if (!isMounted) return null;

  return (
    <div className="grid grid-cols-4 grid-rows-9 gap-2">
      {medias.map((media, index) => (
        <GridCell
          key={index}
          url={media.url}
          className={`
            ${index === 0 ? "col-span-2 row-span-2" : ""}
            ${index === 1 ? "col-start-3" : ""}
            ${index === 2 ? "col-start-4" : ""}
            ${index === 3 ? "col-start-3 row-start-2" : ""}
            ${index === 4 ? "col-start-4 row-start-2" : ""}
            ${index === 5 ? "row-start-3" : ""}
            ${index === 6 ? "row-start-3" : ""}
            ${index === 7 ? "row-start-3" : ""}
            ${index === 8 ? "row-start-3" : ""}
            ${index === 9 ? "col-span-2 row-span-2 row-start-4" : ""}
            ${index === 10 ? "col-span-2 row-span-2 col-start-3" : ""}
            ${index === 11 ? "row-start-6" : ""}
            ${index === 12 ? "row-start-6" : ""}
            ${index === 13 ? "row-start-6" : ""}
            ${index === 14 ? "row-start-6" : ""}
            ${index === 15 ? "row-start-7" : ""}
            ${index === 17 ? "col-start-2 row-start-7" : ""}
            ${index === 16 ? "col-span-2 row-span-2 col-start-1 row-start-8" : ""}
            ${index === 18 ? "col-span-2 row-span-2 col-start-3 row-start-7" : ""}
            ${index === 19 ? "col-start-3 row-start-9" : ""}
            ${index === 20 ? "col-start-4 row-start-9" : ""}
          `}
        />
      ))}
    </div>
  );
}

export default MediaRow;
