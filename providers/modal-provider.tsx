"use client";

import MediaModal from "@/components/modals/media-modal";
import { useEffect, useState } from "react";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null
  };

  return (
    <>
      <MediaModal />
    </>
  )
}

export default ModalProvider;