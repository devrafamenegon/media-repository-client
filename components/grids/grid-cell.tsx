import Image from "next/image";
import useMediaModal from "@/hooks/use-media-modal";
import Play from "@/public/play.svg";
import { Media, Participant } from "@/types";

interface GridCellProps {
  media: Media;
  participant: Participant;
  className?: string;
}

const GridCell: React.FC<GridCellProps> = ({ 
  media,
  participant,
  className 
}) => {
  const mediaModal = useMediaModal();

  if (!media || !participant) {
    return null;
  }

  const { name, bgColor, txtColor } = participant;
  const { isNsfw, label, url, numericId } = media;

  const mediaThumb = url.replace('.mp4', '.jpg');

  return (
    <div className={`relative cursor-pointer aspect-video overflow-clip ${className}`} onClick={() => mediaModal.onOpen(media)}>
      {isNsfw ? (
        <Image
          width="1920"
          height="1080"
          src={mediaThumb}
          alt="Video thumb"
          className="blur-lg"
        />
      ) : (
        <Image
          width="1920"
          height="1080"
          src={mediaThumb}
          alt="Video thumb"
        />
      )}
      <div className="
          absolute top-0 inset-0 flex gap-2 items-center justify-center 
          bg-gradient-to-t from-black bg-opacity-50 opacity-0 hover:opacity-100 
          transition-opacity duration-300 cursor-pointer
        "
      >
        <Image 
          width="72"
          alt="Play"
          src={Play}
          className="opacity-30 hover:opacity-100 transition-opacity duration-300"
        />
        <div className="absolute top-4 right-4">
        {isNsfw && (
          <div className="flex px-2 rounded-md bg-red-900">
            <span className="font-semibold text-md text-white">NSFW</span>
          </div>
        )}
        </div>
        <div className="absolute flex gap-2 bottom-4 left-4">
          <div className="flex px-2 rounded-md" style={{ backgroundColor: bgColor }}>
            <span className="font-semibold text-md uppercase" style={{ color: txtColor }}>{name}</span>
          </div>
          <span className="line-clamp-1 text-white text-md text-ellipsis overflow-hidden ...">{`#${numericId} - ${label}`}</span>
        </div>
      </div>
    </div>
  )
}

export default GridCell