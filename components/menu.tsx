"use client";

import { ChevronRight, Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";

import { Button } from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { dirtyline, glancyr } from "@/app/fonts";
import useMediaStore from "@/hooks/use-media-store";
import useParticipantStore from "@/hooks/use-participant-store";

interface Routes {
  href: string;
  label: JSX.Element;
  active: boolean;
}

const Menu = () => {
  const pathname = usePathname();
  const { medias } = useMediaStore();
  const { participants } = useParticipantStore();

  const participantsWithMediaCount = participants.map((participant) => {
    const mediaCount = medias.filter((media) => media.participantId === participant.id).length;
    return { ...participant, mediaCount };
  });

  const sortedParticipants = participantsWithMediaCount.sort((a, b) => b.mediaCount - a.mediaCount);

  const routes: Routes[] = sortedParticipants.map((participant) => {
    const label = participant.name;
    const randomIndex = Math.floor(Math.random() * label.length);

    const styledLabel = label
      .split('')
      .map((char, index) => (
        <span key={index} className={index === randomIndex ? 'uppercase' : ''}>
          {char}
        </span>
      ));

    const combinedLabel = (
      <div className="flex flex-col md:flex-row md:gap-6">
        <span>{styledLabel}</span>
        <div className={cn(
          glancyr.className,
          "px-2 pt-1 mb-0 text-base self-start md:mb-7 md:text-lg md:self-end rounded-md bg-tag text-tag-foreground"
        )} >{participant.mediaCount}</div>
      </div>
    );

    return {
      href: `/medias?participantId=${participant.id}`,
      label: combinedLabel,
      active: pathname === `/medias?participantId=${participant.id}`,
    };
  });

  const [open, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <>
      <Button onClick={onOpen} variant="ghost" className="flex items-center rounded-full">
        <MenuIcon size={26} className="hover:scale-110" />
      </Button>

      <Dialog open={open} as="div" className="relative z-40" onClose={onClose}>
        {/* Background */}
        <div className="fixed inset-0 bg-background bg-opacity-25" />

        {/* Dialog position */}
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel className="relative ml-auto flex h-full w-full flex-col overflow-y-scroll py-4 pb-6 shadow-xl">
            
            {/* Close button */}
            <div className="flex items-center justify-end px-4 mr-4">
              <IconButton icon={<X size={26} />} onClick={onClose}/>
            </div>

            {/* Participants */}
            <div className="flex flex-col mt-4 px-8">
              {routes.map((route) => (
                <div key={route.href} className="relative mb-10 sm:mb-6 opacity-75 hover:opacity-100 transition-opacity">
                  <Link
                    href={route.href}
                    className={cn(
                      dirtyline.className,
                      "text-5xl sm:text-8xl lg:text-9xl font-medium font-dirtyline transition-all hover:text-primary",
                      route.active ? "text-primary" : "text-neutral-500"
                    )}
                    onClick={onClose}
                  >
                    {route.label}
                    <div className="absolute top-0 right-0 h-full">
                      <ChevronRight size="100%" />
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default Menu;
