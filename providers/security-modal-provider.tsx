"use client";

import SecurityModal from "@/components/modals/security-modal";
import { useEffect, useState } from "react";

const SecurityModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null
  };

  return (
    <>
      <SecurityModal />
    </>
  )
}

export default SecurityModalProvider;