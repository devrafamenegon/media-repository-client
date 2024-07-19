'use client';

import getParticipant from "@/actions/get-participant";
import MediaGridHorizontal from "@/components/grids/horizontal/media-grid-horizontal";
import HorizontalScroll from "@/components/horizontal-scroll";
import { Skeleton } from "@/components/ui/skeleton";
import { Participant } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const MediasPage = () => {
  const [participant, setParticipant] = useState<Participant>();
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();

  const participantId = searchParams.get('participantId') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const participant = await getParticipant(participantId);

        if (!participant) {
          toast.error('Participant not found.');
          router.push('/');
        } else {
          setParticipant(participant);
        }
      } catch (error) {
        console.log('[MediasPage] - fetchData - error while fetching participant data', error);
        toast.error('Something went wrong.');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [participantId, router]);

  return (
    <HorizontalScroll>
      <div className="p-4 flex flex-row content-container">
        <div className="text-9xl font-semibold self-end text-primary uppercase mr-[400px]">
          { !loading ? participant?.name : (
            <Skeleton className="w-[600px] h-28"/>
          )}
        </div>
        <div className="z-30">
          <MediaGridHorizontal participantId={participantId}/>
        </div>
      </div>
    </HorizontalScroll>
  );
}

export default MediasPage;