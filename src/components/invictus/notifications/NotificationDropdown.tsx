"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  ChevronRight,
  Clock,
  Inbox,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import {
  fetchMyNotifications,
  fetchMyUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/features/invictus/notifications/notificationSlice";
import type { INotificationItem } from "@/lib/features/invictus/notifications/notificationTypes";
import NotificationDetailModal, {
  formatNotificationDate,
  getNotificationIcon,
} from "./NotificationDetailModal";

export default function NotificationDropdown() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<INotificationItem | null>(null);

  const { notifications, unreadCount, loading, actionLoading } = useAppSelector(
    (state) => state.notification
  );

  // Initial fetch and periodic polling every 30s
  useEffect(() => {
    dispatch(fetchMyUnreadCount());
    dispatch(fetchMyNotifications({ limit: 6 }));

    const interval = setInterval(() => {
      dispatch(fetchMyUnreadCount());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  // Refetch latest notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchMyNotifications({ limit: 6 }));
      dispatch(fetchMyUnreadCount());
    }
  }, [isOpen, dispatch]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = (notification: INotificationItem) => {
    if (!notification.isRead) {
      dispatch(markNotificationAsRead(notification._id));
    }
    setSelectedNotification(notification);
    setIsOpen(false);
  };

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (unreadCount > 0) {
      dispatch(markAllNotificationsAsRead());
    }
  };

  const displayNotifications = notifications.slice(0, 6);

  return (
    <>
      <div ref={dropdownRef} className="relative">
        {/* Bell Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Notifications"
          className={`relative flex h-9 w-9 rounded-xl border border-1 flex items-center border-gold-soft  justify-center transition cursor-pointer ${
            isOpen
              ? "bg-[#F3EBD8] text-[#947124]"
              : "text-[#6B6358] hover:bg-[#F3EBD8] hover:text-[#1C1814]"
          }`}
        >
          <Bell size={17}/>

          {/* Unread badge / pulse indicator */}
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#947124] px-1 font-montserrat text-[9px] font-bold text-white shadow-xs ring-2 ring-[#FAF8F5]">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown Menu Popup */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-[#DECDB0] bg-white shadow-xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#EAE2D2] bg-[#FAF8F5] px-4 py-3">
              <div className="flex items-center gap-2">
                <p className="font-playfair text-sm font-bold text-[#1C1814]">
                  Notifications
                </p>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-[#947124]/15 px-2 py-0.5 font-montserrat text-[10px] font-bold text-[#947124]">
                    {unreadCount} New
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  disabled={actionLoading}
                  className="flex items-center gap-1 font-montserrat text-[11px] font-medium text-[#9E7B28] hover:text-[#7C5F1E] transition cursor-pointer disabled:opacity-50"
                >
                  <CheckCheck size={13} />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {/* Notification Items List */}
            <div className="max-h-[360px] overflow-y-auto divide-y divide-[#F2ECE0]">
              {loading && displayNotifications.length === 0 ? (
                <div className="flex items-center justify-center gap-2 py-10 text-xs text-[#7A7062]">
                  <Loader2 size={16} className="animate-spin text-[#947124]" />
                  <span>Loading updates...</span>
                </div>
              ) : displayNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF4E6] text-[#9E7B28]">
                    <Inbox size={20} />
                  </div>
                  <p className="mt-3 text-xs font-semibold text-[#1C1814]">
                    No notifications yet
                  </p>
                  <p className="mt-1 text-[11px] text-[#7A7062] max-w-[200px]">
                    Updates on your challenge, bookings, and certificates will appear here.
                  </p>
                </div>
              ) : (
                displayNotifications.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleNotificationClick(item)}
                    className={`group flex items-start gap-3 p-3.5 transition cursor-pointer ${
                      item.isRead
                        ? "bg-white hover:bg-[#FAF8F5]"
                        : "bg-[#FAF6EE]/80 hover:bg-[#FAF4E6]"
                    }`}
                  >
                    {/* Category Icon */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                        item.isRead
                          ? "border-[#EAE2D2] bg-[#FAF8F5]"
                          : "border-[#DECDB0] bg-[#F4EFE6]"
                      }`}
                    >
                      {getNotificationIcon(item.type, 15)}
                    </div>

                    {/* Notification content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4
                          className={`text-xs truncate ${
                            item.isRead
                              ? "font-medium text-[#1C1814]"
                              : "font-bold text-[#1C1814]"
                          }`}
                        >
                          {item.title}
                        </h4>
                        {!item.isRead && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#947124]" />
                        )}
                      </div>

                      <p className="text-[11px] text-[#7A7062] line-clamp-2 leading-relaxed">
                        {item.body}
                      </p>

                      <div className="flex items-center gap-1 text-[10px] text-[#A69B89]">
                        <Clock size={10} />
                        <span>{formatNotificationDate(item.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-[#EAE2D2] bg-[#FAF8F5] p-2.5 text-center">
              <Link
                href="/invictus/notifications"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center gap-1 font-montserrat text-xs font-semibold text-[#947124] hover:text-[#7C5F1E] transition py-1 px-3 rounded-lg hover:bg-[#F3EBD8]"
              >
                <span>View all notifications</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          open={Boolean(selectedNotification)}
          onClose={() => setSelectedNotification(null)}
        />
      )}
    </>
  );
}
