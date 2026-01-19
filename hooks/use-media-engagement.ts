import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

import getReactionTypes from "@/actions/get-reaction-types";
import getMediaReactions, { MediaReactionsResponse } from "@/actions/get-media-reactions";
import setMediaReaction from "@/actions/set-media-reaction";
import deleteMediaReaction from "@/actions/delete-media-reaction";
import registerMediaView from "@/actions/register-media-view";
import getMediaComments from "@/actions/get-media-comments";
import createMediaComment from "@/actions/create-media-comment";
import deleteMediaComment from "@/actions/delete-media-comment";
import { MediaComment, ReactionType } from "@/types";

type Params = {
  mediaId?: string;
  userId?: string | null;
  enabled?: boolean;
};

export const useMediaEngagement = ({ mediaId, userId, enabled = true }: Params) => {
  const [reactionTypes, setReactionTypes] = useState<ReactionType[]>([]);
  const [reactions, setReactions] = useState<MediaReactionsResponse | null>(null);
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [comments, setComments] = useState<MediaComment[]>([]);
  const [commentBody, setCommentBody] = useState("");
  const [loading, setLoading] = useState(false);

  const reactionsRef = useRef<MediaReactionsResponse | null>(null);
  useEffect(() => {
    reactionsRef.current = reactions;
  }, [reactions]);

  const latestReactSeqByTypeRef = useRef<Record<string, number>>({});
  const pendingDesiredSelectedByTypeRef = useRef<Record<string, boolean>>({});

  const countsByTypeId = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of reactions?.counts ?? []) {
      map.set(item.reactionTypeId, item.count);
    }
    return map;
  }, [reactions]);

  const myReactionTypeIds = reactions?.myReactionTypeIds ?? [];

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!enabled) return;
      if (!mediaId) return;
      if (!userId) return;

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/98543d2a-0de0-4c31-819d-abdaf7952873',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'shorts-engagement-1',hypothesisId:'H1',location:'use-media-engagement.ts:run_start',message:'engagement fetch start',data:{mediaId,enabled,hasUserId:Boolean(userId)},timestamp:Date.now()})}).catch(()=>{});
      // #endregion

      setLoading(true);
      setReactions(null);
      setViewCount(null);
      setComments([]);
      setCommentBody("");

      // limpa pendências de reação ao trocar de mídia
      latestReactSeqByTypeRef.current = {};
      pendingDesiredSelectedByTypeRef.current = {};

      try {
        const safe = async <T,>(name: string, fn: () => Promise<T>): Promise<T> => {
          try {
            return await fn();
          } catch (e) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/98543d2a-0de0-4c31-819d-abdaf7952873',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'shorts-engagement-1',hypothesisId:'H2',location:'use-media-engagement.ts:run_error',message:'engagement fetch failed',data:{mediaId,name,error:String(e)},timestamp:Date.now()})}).catch(()=>{});
            // #endregion
            throw e;
          }
        };

        const [viewRes, typesRes, reactionsRes, commentsRes] = await Promise.all([
          safe("registerMediaView", () => registerMediaView(mediaId)),
          safe("getReactionTypes", () => getReactionTypes()),
          safe("getMediaReactions", () => getMediaReactions(mediaId)),
          safe("getMediaComments", () => getMediaComments(mediaId)),
        ]);

        if (cancelled) return;
        setViewCount(viewRes?.viewCount ?? null);
        setReactionTypes(typesRes ?? []);
        setReactions(reactionsRes ?? null);
        setComments(commentsRes ?? []);

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/98543d2a-0de0-4c31-819d-abdaf7952873',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'shorts-engagement-1',hypothesisId:'H3',location:'use-media-engagement.ts:run_success',message:'engagement fetch success',data:{mediaId,viewCount:viewRes?.viewCount??null,typesLen:typesRes?.length??0,countsLen:reactionsRes?.counts?.length??0,commentsLen:commentsRes?.length??0},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
      } catch (error) {
        console.log("[useMediaEngagement] - error while fetching", error);
        toast.error("Something went wrong.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [enabled, mediaId, userId]);

  const onReact = async (reactionTypeId: string) => {
    if (!enabled) return;
    if (!mediaId) return;
    if (!userId) return;

    const prev = reactionsRef.current;
    let reactSeq = 0;

    try {
      const currentMy = prev?.myReactionTypeIds ?? [];
      const alreadySelected = currentMy.includes(reactionTypeId);
      const desiredSelected = !alreadySelected;

      reactSeq = (latestReactSeqByTypeRef.current[reactionTypeId] ?? 0) + 1;
      latestReactSeqByTypeRef.current[reactionTypeId] = reactSeq;
      pendingDesiredSelectedByTypeRef.current[reactionTypeId] = desiredSelected;

      // otimista
      const optimisticCounts = new Map<string, number>();
      for (const item of prev?.counts ?? []) optimisticCounts.set(item.reactionTypeId, item.count);
      const optimisticMy = new Set<string>(currentMy);

      if (alreadySelected) {
        optimisticMy.delete(reactionTypeId);
        optimisticCounts.set(
          reactionTypeId,
          Math.max(0, (optimisticCounts.get(reactionTypeId) ?? 0) - 1)
        );
      } else {
        optimisticMy.add(reactionTypeId);
        optimisticCounts.set(reactionTypeId, (optimisticCounts.get(reactionTypeId) ?? 0) + 1);
      }

      setReactions({
        counts: Array.from(optimisticCounts.entries()).map(([id, count]) => ({
          reactionTypeId: id,
          count,
        })),
        myReactionTypeIds: Array.from(optimisticMy),
        topReactorsByType: prev?.topReactorsByType,
      });

      const next = alreadySelected
        ? await deleteMediaReaction(mediaId, reactionTypeId)
        : await setMediaReaction(mediaId, reactionTypeId);

      // stale (mesmo tipo)
      if ((latestReactSeqByTypeRef.current[reactionTypeId] ?? 0) !== reactSeq) {
        return;
      }

      // confirmação do último clique deste tipo
      delete pendingDesiredSelectedByTypeRef.current[reactionTypeId];

      const applyPendingOverlay = (base: MediaReactionsResponse): MediaReactionsResponse => {
        const countsMap = new Map<string, number>();
        for (const c of base.counts ?? []) countsMap.set(c.reactionTypeId, c.count);
        const mySet = new Set<string>(base.myReactionTypeIds ?? []);

        for (const [typeId, desired] of Object.entries(pendingDesiredSelectedByTypeRef.current)) {
          const has = mySet.has(typeId);
          if (desired && !has) {
            mySet.add(typeId);
            countsMap.set(typeId, (countsMap.get(typeId) ?? 0) + 1);
          } else if (!desired && has) {
            mySet.delete(typeId);
            const nextCount = Math.max(0, (countsMap.get(typeId) ?? 0) - 1);
            if (nextCount <= 0) countsMap.delete(typeId);
            else countsMap.set(typeId, nextCount);
          }
        }

        return {
          ...base,
          counts: Array.from(countsMap.entries()).map(([id, count]) => ({ reactionTypeId: id, count })),
          myReactionTypeIds: Array.from(mySet),
        };
      };

      setReactions(applyPendingOverlay(next));
    } catch (error) {
      console.log("[useMediaEngagement] - onReact - error", error);
      toast.error("Something went wrong.");

      // evita rollback stale do mesmo tipo
      if ((latestReactSeqByTypeRef.current[reactionTypeId] ?? 0) !== reactSeq) {
        return;
      }
      delete pendingDesiredSelectedByTypeRef.current[reactionTypeId];
      setReactions(prev ?? null);
    }
  };

  const onSubmitComment = async () => {
    if (!enabled) return;
    if (!mediaId) return;
    if (!userId) return;
    if (!commentBody.trim()) return;

    try {
      const created = await createMediaComment(mediaId, commentBody.trim());
      setComments((prev) => [created, ...prev]);
      setCommentBody("");
    } catch (error) {
      console.log("[useMediaEngagement] - onSubmitComment - error", error);
      toast.error("Something went wrong.");
    }
  };

  const onDeleteComment = async (commentId: string) => {
    if (!enabled) return;
    if (!mediaId) return;
    if (!userId) return;

    try {
      await deleteMediaComment(mediaId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      console.log("[useMediaEngagement] - onDeleteComment - error", error);
      toast.error("Something went wrong.");
    }
  };

  return {
    loading,
    reactionTypes,
    reactions,
    viewCount,
    comments,
    commentBody,
    setCommentBody,
    countsByTypeId,
    myReactionTypeIds,
    onReact,
    onSubmitComment,
    onDeleteComment,
    setReactions,
    setViewCount,
    setComments,
    setReactionTypes,
  };
};

