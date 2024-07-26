"use client";

import useSecurityModal from "@/hooks/use-security-modal";
import { useState } from "react";
import { Modal } from "../ui/modal";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const SecurityModal = () => {
  const router = useRouter();
  const securityModal = useSecurityModal();
  const [password, setPassword] = useState("");

  const handleUnlock = (event: React.FormEvent) => {
    event.preventDefault();
    securityModal.onUnlock(password);
    setPassword("");
  }

  const handleBack = () => {
    router.push("/");
  }

  return (
    <Modal 
      title="Enter Password to Unlock"
      description="Type the password to enter"
      isOpen={securityModal.isOpen}
      onClose={securityModal.onClose}
    >
      <div className="w-full flex justify-start items-center py-4">
        <form onSubmit={handleUnlock} className="flex flex-col gap-4 w-full">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="p-2 border rounded"
          />
          <Button type="submit" className="px-4 py-2 rounded">
            Unlock
          </Button>
          <Button type="button" className="px-4 py-2 rounded" variant="outline" onClick={handleBack}>
            Back
          </Button>
        </form>
      </div>
    </Modal>
  )
};

export default SecurityModal;
