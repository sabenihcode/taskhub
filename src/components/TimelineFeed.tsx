"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime, timeAgo } from "@/lib/date-utils";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { addTimelineEvent, subscribeToTimeline } from "@/lib/firebase/db";
import type { TimelineEvent } from "@/types";
import {
  MessageSquare,
  RefreshCw,
  UserCheck,
  PlusCircle,
  AlertCircle,
  Send,
  Loader2,
} from "lucide-react";

interface TimelineFeedProps {
  requestId: string;
  events: TimelineEvent[];
}

const actionConfig: Record<
  string,
  { icon: React.ReactNode; color: string; label: string }
> = {
  comment: {
    icon: <MessageSquare className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-700",
    label: "Comment",
  },
  status_changed: {
    icon: <RefreshCw className="h-4 w-4" />,
    color: "bg-purple-100 text-purple-700",
    label: "Status Changed",
  },
  assigned: {
    icon: <UserCheck className="h-4 w-4" />,
    color: "bg-teal-100 text-teal-700",
    label: "Assigned",
  },
  created: {
    icon: <PlusCircle className="h-4 w-4" />,
    color: "bg-green-100 text-green-700",
    label: "Created",
  },
};

export function TimelineFeed({ requestId, events: initialEvents }: TimelineFeedProps) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [events, setEvents] = useState<TimelineEvent[]>(initialEvents);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Realtime subscription
  useEffect(() => {
    const unsubscribe = subscribeToTimeline(requestId, (newEvents) => {
      setEvents(newEvents);
    });
    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [requestId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || loading) return;

    setLoading(true);
    try {
      await addTimelineEvent({
        requestId,
        actorId: user?.id || "anonymous",
        actorName: user?.name || "Anonymous",
        action: "comment",
        message: message.trim(),
      });

      setMessage("");
      // Realtime subscription will auto-update events
      queryClient.invalidateQueries({ queryKey: ["timeline", requestId] });
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Gagal menambahkan komentar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tambahkan komentar atau update..."
          rows={3}
          disabled={loading || !user}
          className="rounded-xl resize-none"
        />
        <div className="flex justify-between items-center">
          <p className="text-xs text-slate-400">
            {user ? "Posting sebagai " + user.name : "Login untuk komentar"}
          </p>
          <Button
            type="submit"
            disabled={loading || !message.trim() || !user}
            className="rounded-xl"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Kirim Komentar
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Timeline */}
      {events.length === 0 ? (
        <p className="text-sm text-slate-500 italic text-center py-8">
          Belum ada aktivitas
        </p>
      ) : (
        <div className="relative space-y-6 pl-8 before:absolute before:left-[13px] before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:to-transparent">
          {events.map((event) => {
            const config = actionConfig[event.action] || {
              icon: <AlertCircle className="h-3.5 w-3.5" />,
              color: "bg-slate-100 text-slate-700",
              label: event.action,
            };

            return (
              <div key={event.id} className="relative">
                {/* Timeline Icon */}
                <div
                  className={`absolute -left-8 flex h-7 w-7 items-center justify-center rounded-full ring-4 ring-white shadow-sm ${config.color}`}
                >
                  {config.icon}
                </div>

                {/* Timeline Content */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-900">
                          {event.actorName || "System"}
                        </p>
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 uppercase tracking-wider">
                          {config.label}
                        </span>
                      </div>
                    </div>
                    <time
                      className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0"
                      title={formatDateTime(event.createdAt)}
                    >
                      {timeAgo(event.createdAt)}
                    </time>
                  </div>

                  {event.message && (
                    <p className="mt-3 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {event.message}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}