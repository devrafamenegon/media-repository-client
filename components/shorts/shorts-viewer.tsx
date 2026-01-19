"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";

import getMediaFeed from "@/actions/get-media-feed";
import { Media } from "@/types";
import { useMediaEngagement } from "@/hooks/use-media-engagement";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Props = {
  participantId?: string;
};

function safeUUID() {
  try {
    return crypto.randomUUID();
  } catch {
    return `seed_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }
}

const ShortsViewer = ({ participantId }: Props) => {
  const { userId } = useAuth();

  const seedRef = useRef<string>(safeUUID());
  const [items, setItems] = useState<Media[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(0);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [activeId, setActiveId] = useState<string | null>(null);
  const activeMedia = useMemo(() => items.find((m) => m.id === activeId) ?? null, [items, activeId]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  // engagement apenas do vídeo ativo
  const engagement = useMediaEngagement({
    enabled: Boolean(activeId),
    mediaId: activeId ?? undefined,
    userId,
  });

  // carrega feed inicial
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setLoadingFeed(true);
        const res = await getMediaFeed({
          seed: seedRef.current,
          cursor: 0,
          take: 10,
          participantId,
        });
        if (cancelled) return;
        setItems(res.items ?? []);
        setNextCursor(res.nextCursor);
        setActiveId(res.items?.[0]?.id ?? null);
      } catch (e) {
        console.log("[ShortsViewer] - initial feed error", e);
        toast.error("Something went wrong.");
      } finally {
        if (!cancelled) setLoadingFeed(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [participantId]);

  // observer do item ativo
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        const id = (best?.target as HTMLElement | undefined)?.dataset?.mediaId;
        if (id) setActiveId(id);
      },
      { root, threshold: [0.6] }
    );

    for (const m of items) {
      const el = itemRefs.current[m.id];
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  // play/pause
  useEffect(() => {
    for (const [id, v] of Object.entries(videoRefs.current)) {
      if (!v) continue;
      if (id === activeId) {
        v.play().catch(() => {});
      } else {
        try {
          v.pause();
        } catch {}
      }
    }
  }, [activeId]);

  // prefetch
  useEffect(() => {
    if (!items.length) return;
    if (nextCursor == null) return;
    if (loadingFeed || loadingMore) return;

    const idx = items.findIndex((m) => m.id === activeId);
    if (idx < 0) return;

    if (idx >= items.length - 3) {
      let cancelled = false;
      const run = async () => {
        try {
          setLoadingMore(true);
          const res = await getMediaFeed({
            seed: seedRef.current,
            cursor: nextCursor,
            take: 10,
            participantId,
          });
          if (cancelled) return;
          setItems((prev) => [...prev, ...(res.items ?? [])]);
          setNextCursor(res.nextCursor);
        } catch (e) {
          console.log("[ShortsViewer] - load more error", e);
        } finally {
          if (!cancelled) setLoadingMore(false);
        }
      };
      run();
      return () => {
        cancelled = true;
      };
    }
  }, [activeId, items, nextCursor, loadingFeed, loadingMore, participantId]);

  // painel comments: desktop fixo / mobile dialog
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  useEffect(() => {
    setShowAllComments(false);
  }, [activeId]);

  // hover-aware para dropdown
  const [canHover, setCanHover] = useState(false);
  const [reactionsMenuOpen, setReactionsMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia?.("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(Boolean(mq?.matches));
    update();
    mq?.addEventListener?.("change", update);
    return () => mq?.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (!canHover) return;
    if (!reactionsMenuOpen) return;

    const onMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const triggerRect = triggerRef.current?.getBoundingClientRect();
      const contentRect = contentRef.current?.getBoundingClientRect();

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

      const BRIDGE_PX = 12;
      const withinBridge =
        triggerRect && contentRect
          ? (() => {
              const left = Math.max(triggerRect.left, contentRect.left);
              const right = Math.min(triggerRect.right, contentRect.right);
              const xOk = x >= left && x <= right;

              const gapTop = triggerRect.bottom;
              const gapBottom = contentRect.top;
              const yOkDown =
                y >= Math.min(gapTop, gapBottom) - BRIDGE_PX &&
                y <= Math.max(gapTop, gapBottom) + BRIDGE_PX;

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

  const hoverNamesByTypeId = engagement.reactions?.topReactorsByType ?? {};

  const reactionsSummary = useMemo(() => {
    return engagement.reactionTypes
      .map((rt) => ({
        id: rt.id,
        emoji: rt.emoji ?? "?",
        label: rt.label,
        count: engagement.countsByTypeId.get(rt.id) ?? 0,
        order: rt.order ?? 0,
        selected: engagement.myReactionTypeIds.includes(rt.id),
      }))
      .filter((x) => x.count > 0)
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.order - b.order;
      });
  }, [engagement.reactionTypes, engagement.countsByTypeId, engagement.myReactionTypeIds]);

  const visibleComments = showAllComments ? engagement.comments : engagement.comments.slice(0, 3);
  const hasMoreComments = engagement.comments.length > 3;

  const EngagementPanel = (
    <div className="h-full flex flex-col">
      <div className="flex flex-col gap-4 p-4 border-l border-border h-full">
        <div className="flex flex-col gap-1">
          <div className="text-sm text-muted-foreground">Agora vendo</div>
          <div className="font-medium line-clamp-2">
            {activeMedia ? `#${activeMedia.numericId} - ${activeMedia.label}` : "-"}
          </div>
        </div>

        <div className="flex flex-row items-center gap-2">
          <span className="text-sm text-muted-foreground">Views:</span>
          {engagement.loading ? (
            <Skeleton className="h-4 w-14" />
          ) : (
            <span className="text-sm text-muted-foreground">{engagement.viewCount ?? "-"}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center justify-between gap-2">
            <span className="text-sm text-muted-foreground">Reações</span>
            <DropdownMenu open={reactionsMenuOpen} onOpenChange={setReactionsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  ref={triggerRef}
                  type="button"
                  variant="secondary"
                  disabled={engagement.loading || !activeId}
                  onPointerEnter={
                    canHover
                      ? () => {
                          if (engagement.loading) return;
                          setReactionsMenuOpen(true);
                        }
                      : undefined
                  }
                >
                  Reagir
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent ref={contentRef} align="end" className="p-2">
                <div className="flex flex-row flex-nowrap gap-2 overflow-x-auto max-w-[70vw] sm:max-w-[420px] pb-1">
                  {engagement.reactionTypes.map((rt) => {
                    const selected = engagement.myReactionTypeIds.includes(rt.id);
                    return (
                      <Button
                        key={rt.id}
                        type="button"
                        variant={selected ? "default" : "secondary"}
                        size="sm"
                        onClick={() => engagement.onReact(rt.id)}
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

          {engagement.loading ? (
            <div className="flex flex-row flex-nowrap gap-2 overflow-x-auto w-full max-w-full pr-1 pb-1">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={idx} className="h-8 w-16 rounded-md shrink-0" />
              ))}
            </div>
          ) : reactionsSummary.length > 0 ? (
            <div className="flex flex-row flex-nowrap gap-2 overflow-x-auto w-full max-w-full pr-1 pb-1">
              {reactionsSummary.map((r) => {
                const hover = hoverNamesByTypeId[r.id];
                const names = hover?.names ?? [];
                const more = hover?.moreCount ?? 0;
                const title = names.length > 0 ? `${names.join(", ")}${more > 0 ? ` (+${more})` : ""}` : r.label;
                return (
                  <Button
                    key={r.id}
                    type="button"
                    variant={r.selected ? "default" : "secondary"}
                    size="sm"
                    onClick={() => engagement.onReact(r.id)}
                    disabled={engagement.loading || !activeId}
                    className="gap-2 shrink-0"
                    title={title}
                  >
                    <span>{r.emoji}</span>
                    <span className="text-xs text-muted-foreground">{r.count}</span>
                  </Button>
                );
              })}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Sem reações ainda.</span>
          )}
        </div>

        <div className="flex flex-col gap-2 flex-1 min-h-0">
          <div className="flex flex-row gap-2">
            {engagement.loading ? (
              <>
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-24 rounded-md" />
              </>
            ) : (
              <>
                <Input
                  placeholder="Escreva um comentário..."
                  value={engagement.commentBody}
                  onChange={(e) => engagement.setCommentBody(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    if ((e.nativeEvent as any)?.isComposing) return;
                    e.preventDefault();
                    engagement.onSubmitComment();
                  }}
                  disabled={engagement.loading || !activeId}
                />
                <Button
                  type="button"
                  onClick={engagement.onSubmitComment}
                  disabled={engagement.loading || !engagement.commentBody.trim() || !activeId}
                >
                  Enviar
                </Button>
              </>
            )}
          </div>

          <div className="flex flex-col gap-3 pr-1 overflow-y-auto min-h-0">
            {engagement.loading ? (
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
              <>
                {visibleComments.map((c) => {
                  const mine = c.userId === userId;
                  return (
                    <div key={c.id} className="flex flex-row gap-3 items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-row items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-sm font-medium">{c.authorName ?? "User"}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                            </span>
                          </div>
                          {mine && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => engagement.onDeleteComment(c.id)}
                              disabled={engagement.loading}
                            >
                              Apagar
                            </Button>
                          )}
                        </div>
                        <p className="text-sm break-words break-all whitespace-pre-wrap max-w-full">{c.body}</p>
                      </div>
                    </div>
                  );
                })}

                {engagement.comments.length === 0 && (
                  <span className="text-sm text-muted-foreground mt-2">Sem comentários ainda.</span>
                )}

                {!showAllComments && hasMoreComments && (
                  <Button type="button" variant="secondary" onClick={() => setShowAllComments(true)} className="self-start">
                    Ver mais comentários
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-[100vh] w-full flex flex-row">
      <div className="flex-1 relative bg-black">
        <div ref={containerRef} className="h-[100vh] overflow-y-auto snap-y snap-mandatory no-scrollbar">
          {loadingFeed ? (
            <div className="h-[100vh] flex items-center justify-center">
              <Skeleton className="h-[70vh] w-[min(420px,90vw)] rounded-3xl" />
            </div>
          ) : (
            items.map((m) => (
              <div
                key={m.id}
                data-media-id={m.id}
                ref={(el) => {
                  itemRefs.current[m.id] = el;
                }}
                className="h-[100vh] snap-start flex items-center justify-center"
              >
                <div className="h-[100vh] w-full flex items-center justify-center">
                  <video
                    ref={(el) => {
                      videoRefs.current[m.id] = el;
                    }}
                    src={m.url}
                    playsInline
                    muted
                    controls
                    className="h-[100vh] w-full object-contain"
                  />
                </div>
              </div>
            ))
          )}
          {loadingMore && (
            <div className="h-[30vh] flex items-center justify-center">
              <Skeleton className="h-10 w-40" />
            </div>
          )}
        </div>

        {/* Mobile: botão flutuante para abrir painel */}
        <div className="md:hidden fixed bottom-4 right-4 z-30">
          <Button type="button" onClick={() => setMobilePanelOpen(true)} disabled={!activeId}>
            Comentários
          </Button>
        </div>

        <Dialog open={mobilePanelOpen} onOpenChange={setMobilePanelOpen}>
          <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes</DialogTitle>
            </DialogHeader>
            {EngagementPanel}
          </DialogContent>
        </Dialog>
      </div>

      {/* Desktop: painel à direita */}
      <div className="hidden md:block w-[420px] h-[100vh] bg-background">
        {EngagementPanel}
      </div>
    </div>
  );
};

export default ShortsViewer;

