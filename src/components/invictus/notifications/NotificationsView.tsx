"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  Search,
  Filter,
  Inbox,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Sparkles,
  Award,
  CreditCard,
  ShieldCheck,
  Calendar,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import {
  fetchMyNotifications,
  fetchMyUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  markNotificationAsUnread,
} from "@/lib/features/invictus/notifications/notificationSlice";
import type { INotificationItem } from "@/lib/features/invictus/notifications/notificationTypes";
import NotificationDetailModal, {
  formatNotificationDate,
  getNotificationIcon,
} from "./NotificationDetailModal";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CategoryFilter = "all" | "unread" | "payments" | "certificates" | "bookings";

export default function NotificationsView() {
  const dispatch = useAppDispatch();

  const { notifications, meta, unreadCount, loading, actionLoading } =
    useAppSelector((state) => state.notification);

  const [activeTab, setActiveTab] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotification, setSelectedNotification] =
    useState<INotificationItem | null>(null);

  const loadData = (page = 1, isReadFilter?: boolean, search = searchQuery) => {
    dispatch(
      fetchMyNotifications({
        page,
        limit: 12,
        isRead: isReadFilter,
        search: search.trim() || undefined,
      })
    );
    dispatch(fetchMyUnreadCount());
  };

  useEffect(() => {
    const isReadParam =
      activeTab === "unread" ? false : undefined;
    loadData(currentPage, isReadParam, searchQuery);
  }, [activeTab, currentPage, dispatch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    const isReadParam = activeTab === "unread" ? false : undefined;
    loadData(1, isReadParam, searchQuery);
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsAsRead()).then(() => {
      dispatch(fetchMyUnreadCount());
    });
  };

  const handleToggleRead = (e: React.MouseEvent, notification: INotificationItem) => {
    e.stopPropagation();
    if (notification.isRead) {
      dispatch(markNotificationAsUnread(notification._id));
    } else {
      dispatch(markNotificationAsRead(notification._id));
    }
  };

  // Client-side category filtering for tabs
  const filteredNotifications = useMemo(() => {
    if (activeTab === "all" || activeTab === "unread") {
      return notifications;
    }
    return notifications.filter((item) => {
      const t = (item.type || "").toLowerCase();
      if (activeTab === "payments") {
        return t.includes("payment") || t.includes("purchase") || t.includes("entitlement");
      }
      if (activeTab === "certificates") {
        return t.includes("certificate") || t.includes("quiz");
      }
      if (activeTab === "bookings") {
        return t.includes("retreat") || t.includes("booking") || t.includes("mentor");
      }
      return true;
    });
  }, [notifications, activeTab]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] px-4 py-8 md:px-8 md:py-10 text-[#1C1814]">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Back link */}
        <Link
          href="/invictus"
          className="inline-flex items-center gap-1.5 font-montserrat text-xs font-semibold text-[#947124] hover:text-[#7C5F1E] transition hover:-translate-x-1 duration-200"
        >
          &larr; Back to Invictus Hub
        </Link>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-[#EAE2D2] pb-6">
          <div>
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.22em] text-[#9E7B28]">
              ACTIVITY & UPDATES
            </p>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold tracking-wide text-[#1C1814] mt-1">
              Notifications Center
            </h1>
            <p className="text-sm text-[#7A7062] mt-1.5 max-w-xl">
              Stay up to date with your Invictus challenge progress, certificates, payment confirmations, and bookings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <Button
                onClick={handleMarkAllRead}
                disabled={actionLoading}
                variant="outline"
                className="cursor-pointer border-[#DECDB0] bg-white hover:bg-[#FAF4E6] text-[#947124] font-montserrat text-xs font-semibold shadow-2xs"
              >
                <CheckCheck size={14} className="mr-1.5" />
                <span>Mark All as Read ({unreadCount})</span>
              </Button>
            )}

            <button
              onClick={() => loadData(currentPage, activeTab === "unread" ? false : undefined, searchQuery)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#DECDB0] bg-white text-[#7A7062] hover:text-[#1C1814] hover:bg-[#FAF4E6] transition shadow-2xs cursor-pointer"
              title="Refresh"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Controls: Category Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#DECDB0] bg-[#FAF6EE] p-1.5 shadow-2xs">
            {[
              { id: "all", label: "All" },
              { id: "unread", label: `Unread (${unreadCount})` },
              { id: "payments", label: "Payments & Access" },
              { id: "certificates", label: "Certificates" },
              { id: "bookings", label: "Bookings" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as CategoryFilter);
                  setCurrentPage(1);
                }}
                className={`cursor-pointer rounded-lg px-3.5 py-1.5 font-montserrat text-xs font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-[#947124] text-white shadow-xs"
                    : "text-[#7A7062] hover:bg-white hover:text-[#1C1814]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
            <Input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 border-[#DECDB0] bg-white pl-9 pr-3 text-xs focus-visible:ring-[#947124]"
            />
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A69B89]"
            />
          </form>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {loading && filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[#DECDB0] bg-white p-12 text-center shadow-xs">
              <Loader2 size={24} className="animate-spin text-[#947124]" />
              <p className="mt-3 font-montserrat text-xs font-semibold text-[#7A7062]">
                Loading notifications...
              </p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[#DECDB0] bg-white p-12 text-center shadow-xs">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAF4E6] text-[#9E7B28] border border-[#DECDB0]/60">
                <Inbox size={28} />
              </div>
              <h3 className="mt-4 font-playfair text-lg font-bold text-[#1C1814]">
                No Notifications Found
              </h3>
              <p className="mt-1 max-w-sm text-xs text-[#7A7062] leading-relaxed">
                {searchQuery
                  ? `No notifications matched your search "${searchQuery}".`
                  : activeTab === "unread"
                    ? "You're all caught up! There are no unread notifications."
                    : "You do not have any notifications in this category yet."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <div
                key={item._id}
                onClick={() => setSelectedNotification(item)}
                className={`group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border p-5 shadow-2xs transition-all duration-200 cursor-pointer ${
                  item.isRead
                    ? "border-[#DECDB0]/60 bg-white hover:border-[#9E7B28]/60 hover:shadow-xs"
                    : "border-[#DECDB0] bg-[#FAF6EE] hover:border-[#9E7B28] hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Category Icon */}
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                      item.isRead
                        ? "border-[#EAE2D2] bg-[#FAF8F5]"
                        : "border-[#DECDB0] bg-white shadow-2xs"
                    }`}
                  >
                    {getNotificationIcon(item.type, 20)}
                  </div>

                  {/* Title & Body */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-sm tracking-tight ${
                          item.isRead
                            ? "font-semibold text-[#1C1814]"
                            : "font-bold text-[#1C1814]"
                        }`}
                      >
                        {item.title}
                      </h4>
                      {!item.isRead && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#947124] px-2 py-0.5 font-montserrat text-[9px] font-bold text-white uppercase tracking-wider">
                          New
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#5C5348] line-clamp-2 leading-relaxed">
                      {item.body}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-[#A69B89]">
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-[#9E7B28]" />
                        <span>{formatNotificationDate(item.createdAt)}</span>
                      </div>
                      <span>•</span>
                      <span className="uppercase tracking-wider font-montserrat text-[10px]">
                        {item.type.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleToggleRead(e, item)}
                    title={item.isRead ? "Mark as unread" : "Mark as read"}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DECDB0] bg-white text-[#7A7062] hover:text-[#947124] hover:border-[#947124] transition cursor-pointer"
                  >
                    {item.isRead ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>

                  {item.actionUrl && (
                    <Link
                      href={item.actionUrl}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#947124] px-3 py-1.5 font-montserrat text-xs font-semibold text-white shadow-2xs hover:bg-[#7C5F1E] transition cursor-pointer"
                    >
                      <span>Open</span>
                      <ExternalLink size={12} />
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#EAE2D2] pt-6">
            <p className="text-xs text-[#7A7062]">
              Showing Page <strong className="text-[#1C1814]">{meta.page}</strong> of{" "}
              <strong className="text-[#1C1814]">{meta.totalPages}</strong> ({meta.total} total)
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1 || loading}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="border-[#DECDB0] bg-white text-[#1C1814] hover:bg-[#FAF4E6] text-xs cursor-pointer"
              >
                <ChevronLeft size={14} className="mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= meta.totalPages || loading}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="border-[#DECDB0] bg-white text-[#1C1814] hover:bg-[#FAF4E6] text-xs cursor-pointer"
              >
                Next
                <ChevronRight size={14} className="ml-1" />
              </Button>
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
    </div>
  );
}
