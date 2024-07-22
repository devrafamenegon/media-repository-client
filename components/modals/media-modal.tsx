"use client";

import useMediaModal from "@/hooks/use-media-modal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

const MediaModal = () => {
  const mediaModal = useMediaModal();
  const media = useMediaModal((state) => state.data);

  if (!media) { 
    return null;
  }

  const onChange = (open: boolean) => {
    if (!open) {
      mediaModal.onClose();
    }
  }

  return (
    <Dialog open={mediaModal.isOpen} onOpenChange={onChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-[60vw] border-0">
        <DialogHeader>
          <DialogTitle>#{media.numericId} - {media.label}</DialogTitle>
          <DialogDescription>
            {media.id}
          </DialogDescription>
        </DialogHeader>
        <div className="w-full">
          <video src={media.url} autoPlay controls className="w-full rounded-3xl"></video>
        </div>
      </DialogContent>
    </Dialog>
  )
};

export default MediaModal;