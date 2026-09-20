"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { inviteToPrivateRoom, PRIVATE_ROOMS } from "@/lib/features/addManager/privateRoomApi";
import type { Manager } from "@/lib/features/addManager/managerTypes";

export default function PrivateRoomInviteModal({
  manager,
  open,
  onOpenChange,
}: {
  manager: Manager;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [room, setRoom] = useState("");
  const [sending, setSending] = useState(false);

  const sendInvite = async () => {
    if (!room) {
      toast.error("Select a private room first");
      return;
    }
    setSending(true);
    try {
      await inviteToPrivateRoom(manager._id, room);
      toast.success(`Invitation sent to ${manager.email}`);
      onOpenChange(false);
      setRoom("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send invitation");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !sending && onOpenChange(next)}>
      <DialogContent className="rounded-2xl py-6 px-5 border-neutral-800 bg-[#292929] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite to private community</DialogTitle>
          <DialogDescription className="text-white">
            Send <span className="font-semibold">{manager.fullName}</span> an email with a direct link to the selected Invictus room.
          </DialogDescription>
        </DialogHeader>
        <Select value={room} onValueChange={(value) => setRoom(value ?? "")} disabled={sending}>
          <SelectTrigger className="h-11 border-neutral-800 bg-neutral-900 text-white">
            <SelectValue placeholder="Choose a community room" className="text-white" />
          </SelectTrigger>
          <SelectContent className="border-neutral-800 bg-neutral-900 text-white">
            {PRIVATE_ROOMS.map((item) => (
              <SelectItem key={item.slug} value={item.slug}>{item.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button variant="default" onClick={() => onOpenChange(false)} disabled={sending}>Cancel</Button>
          <Button variant="invictus" onClick={sendInvite} disabled={sending}>
            {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Send invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
