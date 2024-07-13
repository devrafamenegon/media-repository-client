"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ 
    isOpen, 
    onClose, 
    loading
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null
  };

  return (
    <Modal
      title="Something's wrong, I can feel it."
      description="If the error persists, contact the developers."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end"> 
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Try again
        </Button>
      </div>
    </Modal>
  )
}