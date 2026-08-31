"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Bell,
  CheckCircle2,
  CreditCard,
  Award,
  Sparkles,
  Calendar,
  ExternalLink,
  Clock,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { INotificationItem } from "@/lib/features/invictus/notifications/notificationTypes";
import { useAppDispatch } from "@/lib/redux/store/hook";
import {
  markNotificationAsRead,
  markNotificationAsUnread,
} from "@/lib/features/invictus/notifications/notificationSlice";

interface Props {
  notification: INotificationItem | null;
  open: boolean;
  onClose: () => void;
}

export const getNotificationIcon = (type?: string, size = 18) => {
  const t = (type || "").toLowerCase();
  if (t.includes("payment") || t.includes("purchase")) {
    return <CreditCard size={size} className="text-[#9E7B28]" />;
  }
  if (t.includes("certificate") || t.includes("quiz")) {
    return <Award size={size} className="text-[#C9A84C]" />;
  }
  if (t.includes("retreat") || t.includes("booking") || t.includes("session")) {
    return <Calendar size={size} className="text-[#B18A3A]" />;
  }
  if (t.includes("entitlement") || t.includes("access") || t.includes("approved")) {
    return <ShieldCheck size={size} className="text-emerald-600" />;
  }
  if (t.includes("mentor") || t.includes("profile")) {
    return <UserCheck size={size} className="text-[#947124]" />;
  }
  if (t.includes("alert") || t.includes("warn") || t.includes("error")) {
    return <AlertCircle size={size} className="text-amber-600" />;
  }
  return <Sparkles size={size} className="text-[#9E7B28]" />;
};

export const formatNotificationDate = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSeconds < 60) return "Just now";
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
  if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

export default function NotificationDetailModal({
  notification,
  open,
  onClose,
}: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  if (!notification) return null;

  const handleToggleRead = () => {
    if (notification.isRead) {
      dispatch(markNotificationAsUnread(notification._id));
    } else {
      dispatch(markNotificationAsRead(notification._id));
    }
  };

  const handleAction = () => {
    if (notification.actionUrl) {
      if (!notification.isRead) {
        dispatch(markNotificationAsRead(notification._id));
      }
      onClose();
      router.push(notification.actionUrl);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-[#DECDB0] bg-[#FAF8F5] p-0 overflow-hidden shadow-2xl">
        {/* Header gradient banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#1C1814] via-[#2A2318] to-[#1C1814] px-6 pt-6 pb-5 text-white">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#9E7B28]/20 blur-2xl" />
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#C9A84C]/30 bg-[#9E7B28]/20 text-[#E5C368]">
                {getNotificationIcon(notification.type, 22)}
              </div>
              <div>
                <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A84C]">
                  NOTIFICATION
                </p>
                <DialogTitle className="font-playfair text-lg font-bold text-white leading-snug mt-0.5">
                  {notification.title}
                </DialogTitle>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#7A7062] border-b border-[#EAE2D2] pb-3">
            <div className="flex items-center gap-1.5">
              <Clock size={13} className="text-[#9E7B28]" />
              <span>{formatNotificationDate(notification.createdAt)}</span>
            </div>
            <span className="rounded-full bg-[#EAE2D2] px-2.5 py-0.5 font-montserrat text-[10px] font-semibold uppercase tracking-wider text-[#5C5348]">
              {notification.type.replace(/_/g, " ")}
            </span>
          </div>

          <div className="rounded-xl border border-[#DECDB0] bg-white p-4 text-sm text-[#1C1814] leading-relaxed shadow-2xs">
            <p className="whitespace-pre-line">{notification.body}</p>
          </div>

          {/* Action and Read Status Controls */}
          <div className="flex flex-col gap-2.5 pt-2">
            {notification.actionUrl && (
              <Button
                onClick={handleAction}
                className="w-full cursor-pointer bg-[#947124] text-white hover:bg-[#7C5F1E] font-montserrat text-xs font-bold uppercase tracking-wider shadow-sm transition"
              >
                <span>View Details</span>
                <ExternalLink size={14} className="ml-1.5" />
              </Button>
            )}

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleToggleRead}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A7062] hover:text-[#947124] transition cursor-pointer"
              >
                {notification.isRead ? (
                  <>
                    <EyeOff size={13} />
                    <span>Mark as unread</span>
                  </>
                ) : (
                  <>
                    <Eye size={13} />
                    <span>Mark as read</span>
                  </>
                )}
              </button>

              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="border-[#DECDB0] text-[#5C5348] hover:bg-[#FAF4E6] hover:text-[#1C1814] text-xs font-medium cursor-pointer"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
