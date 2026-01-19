'use client';

import getMedias from "@/actions/get-medias";
import getParticipants from "@/actions/get-participants";
import { dirtyline, glancyr } from "@/app/fonts";
import MediaGridHorizontal from "@/components/grids/horizontal/media-grid-horizontal";
import HorizontalScroll from "@/components/horizontal-scroll";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import useMediaStore from "@/hooks/use-media-store";
import useParticipantStore from "@/hooks/use-participant-store";
import { cn } from "@/lib/utils";
import { Media, Participant } from "@/types";
import { PlaySquare } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const MediasPage = () => {
  const { medias, setMedias } = useMediaStore();
  const { participants, setParticipants } = useParticipantStore();

  const [participant, setParticipant] = useState<Participant>();
  const [participantMedias, setParticipantMedias] = useState<Media[]>([]);
  const [mediasCount, setMediasCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();

  const participantId = searchParams.get('participantId') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!medias.length) {
          const mediasData = await getMedias();
          setMedias(mediasData);
        }

        if (!participants.length) {
          const participantsData = await getParticipants();          
          setParticipants(participantsData);
        }
      } catch (error) {
        console.log('[MediasPage] - fetchData - error while fetching data', error);
        toast.error('Something went wrong.');
        router.push('/');
      }
    };

    fetchData();
  }, [
      setMedias, 
      setParticipants, 
      router, 
      medias, 
      participants,
    ]
  );

  useEffect(() => {
    if (medias.length && participants.length) {
      const participant = participants.find((participant) => participant.id === participantId);

      if (!participant) {
        toast.error('Participant not found.');
      } else {
        setParticipant(participant);
      }

      const filteredMedias = medias.filter((media) => media.participantId === participantId);

      if (!filteredMedias.length) {
        toast.error('Medias with this participant not found.');
      } else {
        setParticipantMedias(filteredMedias);
        setMediasCount(medias.filter((media) => media.participantId === participant?.id).length)
      }

      setLoading(false);
    }
  }, [participantId, medias, participants, setMediasCount]);

  return (
    <HorizontalScroll>
      <div className="mt-16 px-10 flex flex-row content-container">
          <div className={cn(
            dirtyline.className,
            "text-9xl font-semibold self-end text-primary mr-[400px] flex gap-6"
          )}>
            { !loading ? participant?.name : (
              <Skeleton className="w-[600px] h-28"/>
            )}
            { !loading ? (
              <div className={cn(
                glancyr.className,
                "px-2 pt-1 mb-7 text-lg self-end rounded-md bg-tag text-tag-foreground"
              )}>{mediasCount}</div>
            ) : (
              <Skeleton className="w-[35px] h-10 self-end"/>
            )}
          </div>

          {participantId && (
            <div className="self-end mb-0 mr-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/shorts?participantId=${participantId}`)}
                disabled={loading}
                className="rounded-full gap-2 shrink-0"
              >
                <PlaySquare className="h-5 w-5" />
                Shorts
              </Button>
            </div>
          )}
         
        <div className="z-30">
          <MediaGridHorizontal 
            loading={loading}
            participant={participant}
            medias={participantMedias}
          />
        </div>
      </div>
    </HorizontalScroll>
  );
}

export default MediasPage;