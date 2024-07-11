"use client";

import { ArrowBigRight, ArrowRightIcon, ChevronRight, Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";

import { Participant, Routes } from "@/types";
import { Button } from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface MenuProps {
  participants: Participant[];
}

const Menu: React.FC<MenuProps> = ({
  participants,
}) => {
  const pathname = usePathname();

  const routes: Routes[] = participants.map((route) => ({
    href: `/medias?participantId=${route.id}`,
    label: route.name,
    active: pathname === `/medias?participantId=${route.id}`
  }))

  const [open, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <>
      <Button onClick={onOpen} variant="ghost" className="flex items-center rounded-full">
        <MenuIcon
          size={26}
          className="hover:scale-110"
        />
      </Button>

      <Dialog open={open} as="div" className="relative z-40" onClose={onClose}>
        {/* Background */}
        <div className="fixed inset-0 bg-background bg-opacity-25" />

        {/* Dialog position */}
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel className="relative ml-auto flex h-full w-full flex-col overflow-y-auto py-4 pb-6 shadow-xl">
            
            {/* Close button */}
            <div className="flex items-center justify-end px-4 mr-4">
              <IconButton icon={<X size={26} />} onClick={onClose}/>
            </div>

            {/* Participants */}
            <div className="p-4 flex flex-col">
              {routes.map((route) => (
                <div key={route.href} className="relative">
                  <Link
                  href={route.href}
                  className={cn(
                    "flex-1 text-9xl uppercase font-medium mb-6 transition-colors hover:text-primary",
                    route.active ? "text-primary" : "text-neutral-500"
                  )}
                >
                  {route.label}
                  <div className="absolute top-0 right-0 h-full">
                    <ChevronRight  size="100%" />
                  </div>
                </Link>
                </div>
              ))}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
};

export default Menu;