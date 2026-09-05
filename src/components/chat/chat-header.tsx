import { useSelector } from "react-redux";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RootState } from "@/lib/redux/store/store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ChatHeader() {
  const room = useSelector((state: RootState) => state.chat.room);
  const onlineCount = useSelector(
    (state: RootState) => state.chat.onlineUserIds.length,
  );

  return (
    <div className="border-b border-gray-400 px-6 py-4 flex justify-between items-center">
      <div className="flex w-full justify-between items-center  gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Link
                href="/invictus/community-rooms"
                className="text-sm text-[#947124] bg-[#bd964442] hover:text-[#ca941e] h-8 w-8 rounded-full flex justify-center items-center transition-colors duration-200"
              >
                <ArrowLeft size={20} />
              </Link> 
            </TooltipTrigger>
            <TooltipContent>
              <p>Back to rooms</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <h2 className="font-semibold ">{room?.name ?? "Loading..."}</h2>

            <p className="text-sm text-green-600">{onlineCount} online</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Avatar>
                  <AvatarImage src="/group.jpg" />
                  <AvatarFallback>CR</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                {room?.countryName ?? room?.name ?? "Community room"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* <div className="flex gap-2">

        <Button variant="ghost" size="icon">
          <Search />
        </Button>

        <Button variant="ghost" size="icon">
          <MoreVertical />
        </Button>

      </div> */}
    </div>
  );
}
