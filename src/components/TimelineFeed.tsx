"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime, timeAgo } from "@/lib/date-utils";
import { cn } from "@/lib/utils"; // ← TAMBAHKAN INI
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import type { TimelineEvent } from "@/types";
import { MessageSquare, RefreshCw, UserCheck, PlusCircle, AlertCircle } from "lucide-react";

interface TimelineFeedProps {
  requestId: string;
  events: TimelineEvent[];
}

const actionIcons: Record<string, React.ReactNode> = {
  comment: <MessageSquare className="h-4 w-4" />,
  status_changed: <RefreshCw className="h-4 w-4" />,
  assigned: <UserCheck className="h-4 w-4" />,
  created: <PlusCircle className="h-4 w-4" />,
};

const actionColors: Record<string, string> = {
  comment: "bg-blue-100 text-blue-700",
  status_changed: "bg-purple-100 text-purple-700",
  assigned: "bg-teal-100 text-teal-700",
  created: "bg-green-100 text-green-700",
};

export function TimelineFeed({ requestId, events }: TimelineFeedProps) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/requests/${requestId}/timeline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: message.trim(),
          actorId: user?.id,
          actorName: user?.name,
          action: "comment",
        }),
        credentials: "same-origin",
      });
      if (!res.ok) throw new Error("Failed to post comment");
      setMessage("");
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
          className="rounded-xl"
        />
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={loading || !message.trim()}
            className="rounded-xl"
          >
            {loading ? "Mengirim..." : "Kirim Komentar"}
          </Button>
        </div>
      </form>

      {/* Timeline */}
      <div className="relative space-y-6 pl-8 before:absolute before:left-[13px] before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:to-transparent">
        {events.length === 0 ? (
          <p className="text-sm text-slate-500 italic">Belum ada aktivitas</p>
        ) : (
          events.map((event) => {
            const iconColor = actionColors[event.action] || "bg-slate-100 text-slate-700";
            
            return (
              <div key={event.id} className="relative">
                {/* Timeline Icon */}
                <div className={cn(
                  "absolute -left-8 flex h-7 w-7 items-center justify-center rounded-full ring-4 ring-white shadow-sm",
                  iconColor
                )}>
                  {actionIcons[event.action] || <AlertCircle className="h-3.5 w-3.5" />}
                </div>

                {/* Timeline Content */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {event.actorName || "System"}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 capitalize">
                        {event.action.replace(/_/g, " ")}
                      </p>
                    </div>
                    <time
                      className="text-xs text-slate-400 whitespace-nowrap"
                      title={formatDateTime(event.createdAt)}
                    >
                      {timeAgo(event.createdAt)}
                    </time>
                  </div>
                  
                  {event.message && (
                    <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                      {event.message}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}