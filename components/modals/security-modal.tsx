"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import useSecurityModal from "@/hooks/use-security-modal";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const PasswordModal = () => {
  const mediaModal = useSecurityModal();
  const isOpen = useSecurityModal((state) => state.isOpen);
  const [password, setPassword] = useState("");

  const onChange = (open: boolean) => {
    if (!open) {
      mediaModal.onClose();
    }
  }

  const handleUnlock = (event: React.FormEvent) => {
    event.preventDefault();
    mediaModal.onUnlock(password);
    setPassword("");
  }

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-[60vw] border-0">
        <DialogHeader>
          <DialogTitle>Enter Password to Unlock</DialogTitle>
        </DialogHeader>
        <div className="w-full flex justify-center items-center py-4">
          <form onSubmit={handleUnlock} className="flex flex-col items-center gap-4">
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
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
};

export default PasswordModal;
