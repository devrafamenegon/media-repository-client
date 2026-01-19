"use client";

import useMediaModal from "@/hooks/use-media-modal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import Link from "next/link";
import useParticipantStore from "@/hooks/use-participant-store";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
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
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";

const MediaModal = () => {
  const mediaModal = useMediaModal();
  const media = useMediaModal((state) => state.data);
  const { participants } = useParticipantStore();
  const { userId } = useAuth();

  const [reactionTypes, setReactionTypes] = useState<ReactionType[]>([]);
  const [reactions, setReactions] = useState<MediaReactionsResponse | null>(null);
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [comments, setComments] = useState<MediaComment[]>([]);
  const [commentBody, setCommentBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [reactionsMenuOpen, setReactionsMenuOpen] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const latestReactSeqByTypeRef = useRef<Record<string, number>>({});
  const pendingDesiredSelectedByTypeRef = useRef<Record<string, boolean>>({});
  const reactionsTriggerRef = useRef<HTMLButtonElement | null>(null);
  const reactionsContentRef = useRef<HTMLDivElement | null>(null);

  const mediaId = media?.id;
  const numericId = media?.numericId;
  const label = media?.label;
  const url = media?.url;
  const participantId = media?.participantId;

  const participant = useMemo(() => {
    if (!participantId) return undefined;
    return participants.find((p) => p.id === participantId);
  }, [participants, participantId]);

  const id = mediaId ?? "";

  const countsByTypeId = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of reactions?.counts ?? []) {
      map.set(item.reactionTypeId, item.count);
    }
    return map;
  }, [reactions]);

  const myReactionTypeIds = reactions?.myReactionTypeIds ?? [];

  const onChange = (open: boolean) => {
    if (!open) {
      mediaModal.onClose();
    }
  }

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!mediaModal.isOpen) return;
      if (!mediaId) return;
      if (!userId) return;

      setLoading(true);
      setReactions(null);
      setViewCount(null);
      setComments([]);
      setCommentBody("");
      setShowAllComments(false);

      try {
        const [viewRes, typesRes, reactionsRes, commentsRes] = await Promise.all([
          registerMediaView(mediaId),
          getReactionTypes(),
          getMediaReactions(mediaId),
          getMediaComments(mediaId),
        ]);

        if (cancelled) return;
        setViewCount(viewRes?.viewCount ?? null);
        setReactionTypes(typesRes ?? []);
        setReactions(reactionsRes ?? null);
        setComments(commentsRes ?? []);
      } catch (error) {
        console.log("[MediaModal] - error while fetching modal data", error);
        toast.error("Something went wrong.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [mediaModal.isOpen, mediaId, userId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia?.("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(Boolean(mq?.matches));
    update();
    mq?.addEventListener?.("change", update);
    return () => mq?.removeEventListener?.("change", update);
  }, []);

  // Desktop: fecha o menu quando o ponteiro estiver fora do trigger e do conteúdo (sem flicker de portal).
  useEffect(() => {
    if (!canHover) return;
    if (!reactionsMenuOpen) return;

    const onMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      const triggerRect = reactionsTriggerRef.current?.getBoundingClientRect();
      const contentRect = reactionsContentRef.current?.getBoundingClientRect();

      const withinTrigger = triggerRect
        ? x >= triggerRect.left &&
          x <= triggerRect.right &&
          y >= triggerRect.top &&
          y <= triggerRect.bottom
        : false;

      const withinContent = contentRect
        ? x >= contentRect.left &&
          x <= contentRect.right &&
          y >= contentRect.top &&
          y <= contentRect.bottom
        : false;

      // Pequeno "corredor" entre o botão e o menu para evitar fechar no micro-gap
      // que existe entre triggerRect.bottom e contentRect.top (e vice-versa).
      const BRIDGE_PX = 12;
      const withinBridge =
        triggerRect && contentRect
          ? (() => {
              const left = Math.max(triggerRect.left, contentRect.left);
              const right = Math.min(triggerRect.right, contentRect.right);
              const xOk = x >= left && x <= right;

              // menu abaixo do botão (comum)
              const gapTop = triggerRect.bottom;
              const gapBottom = contentRect.top;
              const yOkDown =
                y >= Math.min(gapTop, gapBottom) - BRIDGE_PX &&
                y <= Math.max(gapTop, gapBottom) + BRIDGE_PX;

              // menu acima do botão (caso raro)
              const gapTopUp = contentRect.bottom;
              const gapBottomUp = triggerRect.top;
              const yOkUp =
                y >= Math.min(gapTopUp, gapBottomUp) - BRIDGE_PX &&
                y <= Math.max(gapTopUp, gapBottomUp) + BRIDGE_PX;

              return xOk && (yOkDown || yOkUp);
            })()
          : false;

      if (withinTrigger || withinContent || withinBridge) return;

      setReactionsMenuOpen(false);
    };

    document.addEventListener("pointermove", onMove);
    return () => document.removeEventListener("pointermove", onMove);
  }, [canHover, reactionsMenuOpen]);

  const onReact = async (reactionTypeId: string) => {
    if (!mediaId) return;
    if (!userId) return;

    const prev = reactions;
    let reactReqId = "";
    let reactSeq = 0;
    try {
      const alreadySelected = myReactionTypeIds.includes(reactionTypeId);
      const desiredSelected = !alreadySelected;

      reactReqId = `react_${Date.now()}_${Math.random().toString(16).slice(2)}`;
      reactSeq = (latestReactSeqByTypeRef.current[reactionTypeId] ?? 0) + 1;
      latestReactSeqByTypeRef.current[reactionTypeId] = reactSeq;
      pendingDesiredSelectedByTypeRef.current[reactionTypeId] = desiredSelected;

      // Atualização otimista (UI instantânea)
      const optimisticCounts = new Map(countsByTypeId);
      const optimisticMy = new Set(myReactionTypeIds);

      if (alreadySelected) {
        optimisticMy.delete(reactionTypeId);
        optimisticCounts.set(
          reactionTypeId,
          Math.max(0, (optimisticCounts.get(reactionTypeId) ?? 0) - 1)
        );
      } else {
        optimisticMy.add(reactionTypeId);
        optimisticCounts.set(
          reactionTypeId,
          (optimisticCounts.get(reactionTypeId) ?? 0) + 1
        );
      }

      setReactions({
        counts: Array.from(optimisticCounts.entries()).map(([id, count]) => ({
          reactionTypeId: id,
          count,
        })),
        myReactionTypeIds: Array.from(optimisticMy),
        // preserva os nomes no hover durante a fase otimista (evita "sumir e voltar")
        topReactorsByType: prev?.topReactorsByType,
      });

      const requestStartedAt = Date.now();

      const next = alreadySelected
        ? await deleteMediaReaction(mediaId, reactionTypeId)
        : await setMediaReaction(mediaId, reactionTypeId);

      // Se o usuário clicou de novo enquanto esta request estava em andamento,
      // não podemos aplicar uma resposta antiga (isso causa o "pisca").
      if ((latestReactSeqByTypeRef.current[reactionTypeId] ?? 0) !== reactSeq) {
        return;
      }

      // Confirmação chegou para o último clique deste tipo -> remove pendência deste tipo
      delete pendingDesiredSelectedByTypeRef.current[reactionTypeId];

      // Aplica resposta do servidor + reaplica pendências otimistas de OUTROS tipos (evita "piscar" entre snapshots)
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

      const merged = applyPendingOverlay(next);

      setReactions(merged);
    } catch (error) {
      console.log("[MediaModal] - onReact - error", error);
      toast.error("Something went wrong.");
      // Se já houve outro clique depois, evita rollback "antigo" que também causa flicker.
      if ((latestReactSeqByTypeRef.current[reactionTypeId] ?? 0) !== reactSeq) {
        return;
      }
      delete pendingDesiredSelectedByTypeRef.current[reactionTypeId];
      setReactions(prev ?? null);
    }
  };

  const onSubmitComment = async () => {
    if (!mediaId) return;
    if (!userId) return;
    if (!commentBody.trim()) return;

    try {
      const created = await createMediaComment(mediaId, commentBody.trim());
      setComments((prev) => [created, ...prev]);
      setCommentBody("");
    } catch (error) {
      console.log("[MediaModal] - onSubmitComment - error", error);
      toast.error("Something went wrong.");
    }
  };

  const onDeleteComment = async (commentId: string) => {
    if (!mediaId) return;
    if (!userId) return;

    try {
      await deleteMediaComment(mediaId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      console.log("[MediaModal] - onDeleteComment - error", error);
      toast.error("Something went wrong.");
    }
  };

  const numericIdText = numericId ?? "";
  const labelText = label ?? "";

  const visibleComments = showAllComments ? comments : comments.slice(0, 3);
  const hasMoreComments = comments.length > 3;

  const reactionsSummary = useMemo(() => {
    return reactionTypes
      .map((rt) => ({
        id: rt.id,
        emoji: rt.emoji ?? "?",
        label: rt.label,
        count: countsByTypeId.get(rt.id) ?? 0,
        order: rt.order ?? 0,
        selected: myReactionTypeIds.includes(rt.id),
      }))
      .filter((x) => x.count > 0)
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.order - b.order;
      });
  }, [reactionTypes, countsByTypeId]);

  const hoverNamesByTypeId = reactions?.topReactorsByType ?? {};

  if (!media) {
    return null;
  }

  return (
    <Dialog open={mediaModal.isOpen} onOpenChange={onChange}>
      <DialogContent
        className={[
          "max-w-[90vw] sm:max-w-[60vw] border-0",
          "max-h-[95vh]",
          "overflow-y-auto pr-2",
        ].join(" ")}
      >
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            {participant && (
              <Link href={`/medias?participantId=${participant.id}`} onClick={() => onChange(false)} className="flex px-2 py-1 rounded-md" style={{ backgroundColor: participant.bgColor }}>
                <span className="font-semibold text-md uppercase" style={{ color: participant.txtColor }}>{participant.name}</span>
              </Link>
            )}
            #{numericIdText} - {labelText}
          </DialogTitle>
          <DialogDescription>
            {id}
          </DialogDescription>
        </DialogHeader>
        <div className="mx-auto w-full max-w-[85%] max-h-full">
          <video src={url} autoPlay controls className="w-full rounded-3xl"></video>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-row items-center gap-2">
              <span className="text-sm text-muted-foreground">Views:</span>
              {loading ? (
                <Skeleton className="h-4 w-14" />
              ) : (
                <span className="text-sm text-muted-foreground">
                  {viewCount ?? "-"}
                </span>
              )}
            </div>

            <div className="flex flex-row items-center gap-2">
              {loading ? (
                <div className="flex flex-row flex-nowrap gap-2 overflow-x-auto w-full max-w-full pr-1 pb-1">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-8 w-16 rounded-md shrink-0" />
                  ))}
                </div>
              ) : reactionsSummary.length > 0 ? (
                <div className="flex flex-row flex-nowrap gap-2 overflow-x-auto w-full max-w-full pr-1 pb-1">
                  {reactionsSummary.map((r) => (
                    (() => {
                      const hover = hoverNamesByTypeId[r.id];
                      const names = hover?.names ?? [];
                      const more = hover?.moreCount ?? 0;
                      const title =
                        names.length > 0
                          ? `${names.join(", ")}${more > 0 ? ` (+${more})` : ""}`
                          : r.label;

                      return (
                        <Button
                          key={r.id}
                          type="button"
                          variant={r.selected ? "default" : "secondary"}
                          size="sm"
                          onClick={() => onReact(r.id)}
                          disabled={loading}
                          className="gap-2 shrink-0"
                          title={title}
                        >
                          <span>{r.emoji}</span>
                          <span className="text-xs text-muted-foreground">{r.count}</span>
                        </Button>
                      );
                    })()
                  ))}
                </div>
              ) : null}

              {/* Botão que abre o seletor */}
              <div>
                <DropdownMenu
                  open={reactionsMenuOpen}
                  onOpenChange={setReactionsMenuOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      ref={reactionsTriggerRef}
                      type="button"
                      variant="secondary"
                      disabled={loading}
                      onPointerEnter={
                        canHover
                          ? () => {
                              if (loading) return;
                              setReactionsMenuOpen(true);
                            }
                          : undefined
                      }
                    >
                      Reagir
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    ref={reactionsContentRef}
                    align="end"
                    className="p-2"
                  >
                    <div className="flex flex-row flex-nowrap gap-2 overflow-x-auto max-w-[70vw] sm:max-w-[420px] pb-1">
                      {reactionTypes.map((rt) => {
                        const selected = myReactionTypeIds.includes(rt.id);
                        return (
                          <Button
                            key={rt.id}
                            type="button"
                            variant={selected ? "default" : "secondary"}
                            size="sm"
                            onClick={() => onReact(rt.id)}
                            className="gap-2 shrink-0"
                            title={rt.label}
                          >
                            <span>{rt.emoji ?? "?"}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              {loading ? (
                <>
                  <Skeleton className="h-10 w-full rounded-md" />
                  <Skeleton className="h-10 w-24 rounded-md" />
                </>
              ) : (
                <>
                  <Input
                    placeholder="Escreva um comentário..."
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") return;
                      // evita disparar Enter durante IME/composition (acentos/teclados asiáticos)
                      if ((e.nativeEvent as any)?.isComposing) return;
                      e.preventDefault();
                      onSubmitComment();
                    }}
                    disabled={loading}
                  />
                  <Button type="button" onClick={onSubmitComment} disabled={loading || !commentBody.trim()}>
                    Enviar
                  </Button>
                </>
              )}
            </div>

            <div className="flex flex-col gap-3 pr-1">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2 items-center">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ))
              ) : (
                visibleComments.map((c) => {
                  const mine = c.userId === userId;
                  return (
                    <div key={c.id} className="flex flex-row gap-3 items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-row items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-sm font-medium">
                              {c.authorName ?? "User"}
                            </span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                            </span>
                          </div>
                          {mine && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => onDeleteComment(c.id)}
                              disabled={loading}
                            >
                              Apagar
                            </Button>
                          )}
                        </div>
                        <p className="text-sm break-words break-all whitespace-pre-wrap max-w-full">{c.body}</p>
                      </div>
                    </div>
                  );
                })
              )}

              {!loading && comments.length === 0 && (
                <span className="text-sm text-muted-foreground mt-2">Sem comentários ainda.</span>
              )}

              {!loading && !showAllComments && hasMoreComments && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowAllComments(true)}
                  className="self-start"
                >
                  Ver mais comentários
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
};

export default MediaModal;