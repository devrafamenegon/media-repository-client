"use client";

import useMediaModal from "@/hooks/use-media-modal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import Link from "next/link";
import useParticipantStore from "@/hooks/use-participant-store";

const MediaModal = () => {
  const mediaModal = useMediaModal();
  const media = useMediaModal((state) => state.data);
  const { participants } = useParticipantStore();

  if (!media) { 
    return null;
  }

  const participant = participants.find((participant) => participant.id === media.participantId);

  const { id, numericId, label, url  } = media;

  const onChange = (open: boolean) => {
    if (!open) {
      mediaModal.onClose();
    }
  }

  return (
    <Dialog open={mediaModal.isOpen} onOpenChange={onChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-[60vw] border-0">
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            {participant && (
              <Link href={`/medias?participantId=${participant.id}`} onClick={() => onChange(false)} className="flex px-2 py-1 rounded-md" style={{ backgroundColor: participant.bgColor }}>
                <span className="font-semibold text-md uppercase" style={{ color: participant.txtColor }}>{participant.name}</span>
              </Link>
            )}
            #{numericId} - {label}
          </DialogTitle>
          <DialogDescription>
            {id}
          </DialogDescription>
        </DialogHeader>
        <div className="w-full">
          <video src={url} autoPlay controls className="w-full rounded-3xl"></video>
        </div>
      </DialogContent>
    </Dialog>
  )
};

export default MediaModal;