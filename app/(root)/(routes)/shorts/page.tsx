"use client";

import ShortsViewer from "@/components/shorts/shorts-viewer";
import { useSearchParams } from "next/navigation";

export default function ShortsPage() {
  const searchParams = useSearchParams();
  const participantId = searchParams.get("participantId") || undefined;

  return (
    <div className="h-[100vh] w-full">
      <ShortsViewer participantId={participantId} />
    </div>
  );
}

