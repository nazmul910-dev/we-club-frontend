import { useSelector } from "react-redux";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, MoreVertical } from "lucide-react";
import { RootState } from "@/lib/redux/store/store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function ChatHeader() {
  const room = useSelector((state: RootState) => state.chat.room);
  const onlineCount = useSelector(
    (state: RootState) => state.chat.onlineUserIds.length
  );

  return (
    <div className="border-b border-zinc-800 px-6 py-4 flex justify-between items-center">

      <div className="flex items-center gap-4">

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Avatar>
                <AvatarImage src="/group.jpg" />
                <AvatarFallback>CR</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>{room?.countryName ?? room?.name ?? "Community room"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div>
          <h2 className="font-semibold ">
            {room?.name ?? "Loading..."}
          </h2>

          <p className="text-sm text-green-600">
            {onlineCount} {onlineCount === 1 ? "" : "s"} online
          </p>
        </div>

      </div>

      <div className="flex gap-2">

        <Button variant="ghost" size="icon">
          <Search />
        </Button>

        <Button variant="ghost" size="icon">
          <MoreVertical />
        </Button>

      </div>

    </div>
  );
}