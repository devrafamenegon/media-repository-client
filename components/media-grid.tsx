'use client';

import MediaRow from "./media-row";
import { Media } from "@/types";
import { useEffect, useState } from "react";

interface MediaGridProps {
  medias: Media[]
}

const MediaGrid: React.FC<MediaGridProps> = ({
  medias
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const chunkArray = (array: Media[], size: number) => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
  }

  const mediaChunks = chunkArray(medias, 20);

  return (
    <div className="flex flex-col gap-2">
      {mediaChunks.map((chunk, index) => (
        <MediaRow key={index} medias={chunk} />
      ))}
    </div>
  )
}

export default MediaGrid;