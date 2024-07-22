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
  const mediaThumb = media.url.replace('.mp4', '.jpg');

  return (
    <div className={`relative cursor-pointer aspect-video ${className}`} onClick={() => mediaModal.onOpen(media)}>
      {media.isNsfw ? (
        <Image
          width="1920"
          height="1080"
          src={mediaThumb}
          alt="Video thumb"
          className="blur-sm"
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
        {media.isNsfw && (
          <div className="flex px-2 rounded-md bg-red-900">
            <span className="font-semibold text-md text-white">NSFW</span>
          </div>
        )}
        </div>
        <div className="absolute flex gap-2 bottom-4 left-4">
          <div className="flex px-2 rounded-md" style={{ backgroundColor: bgColor }}>
            <span className="font-semibold text-xl" style={{ color: txtColor }}>{name}</span>
          </div>
          <span className="line-clamp-1 text-white text-xl text-ellipsis overflow-hidden ...">{media.label}</span>
        </div>
      </div>
    </div>
  )
}

export default GridCell