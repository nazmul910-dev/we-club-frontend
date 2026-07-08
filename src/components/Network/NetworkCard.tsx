"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import Avatar from "./Avatar";

interface Props {
  data: any;
}

const roleStyles: Record<string, string> = {
  admin: "border-green-700 text-green-400 bg-green-950/20",

  associate: "border-yellow-700 text-yellow-400 bg-yellow-950/20",

  partner: "border-blue-700 text-blue-400 bg-blue-950/20",

  ceo: "border-purple-700 text-purple-400 bg-purple-950/20",

  ceo_partner: "border-cyan-700 text-cyan-400 bg-cyan-950/20",

  ambassador: "border-emerald-700 text-emerald-400 bg-emerald-950/20",

  we_club_member: "border-gray-700 text-gray-400 bg-gray-900/30",
};

export default function NetworkCard({ data }: Props) {
  const user = data.associate_id;

  const role = user?.role || "associate";

  const badgeClass =
    roleStyles[role] || "border-gray-700 text-gray-400 bg-gray-900/30";

  return (
    <div
      className="
      rounded-[12px] 
      border border-[#5c4518] 
      bg-[#090909] 
      p-5 sm:p-6
      shadow-[0_0_10px_#00000040]
      hover:shadow-[#c9a3276b]
      transition duration-300
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3 sm:gap-4 min-w-0">
          <Avatar image={user?.profileImage} name={user?.fullName || "User"} />

          <div className="min-w-0">
            <h3
              className="
              text-white 
              text-[14px] 
              
              font-playfair 
              font-medium
              truncate
              "
            >
              {user?.fullName}
            </h3>


            <div
              className="
              flex 
              items-center 
              gap-1 
              mt-2 
              text-xs 
              text-gray-400
              "
            >
              <MapPin size={12} />

              <span className="truncate text-[10px]">
                {user?.city}, {user?.country}
              </span>
            </div>
          </div>
        </div>

        {/* <span
          className={`
          shrink-0
          px-3 
          py-1 
          rounded-full 
          text-[9px] 
          sm:text-[10px]
          uppercase 
          tracking-[1.5px]
          border
          ${badgeClass}
          `}
        >
          {role.replace("_"," ")}
        </span> */}
      </div>

      {/* Role + Listing Count */}
      <div
        className="
        mt-4 
        flex 
        items-center 
        justify-between
        gap-2
        "
      >
        <span
          className={`
          shrink-0
          px-3 
          py-0.5
          rounded-full 
          text-[9px] 
          uppercase 
          tracking-[1.5px]
          border
          ${badgeClass}
          `}
        >
          {role.replace("_", " ")}
        </span>

        <div
          className="
          flex 
          items-center 
          gap-1
          text-[9px]
          sm:text-[10px]
          uppercase 
          tracking-[2px]
          text-gray-500
          "
        >
          <span>Collaborating</span>

          <span
            className="
            text-white 
            text-xs
            "
          >
            {data?.totalActiveListings || 0}
          </span>

          <span>Listings</span>
        </div>
      </div>

      {/* Latest Listing */}
      <div
        className="
        mt-5 
        border 
        border-[#3e3014]
        rounded-xl 
        p-3 sm:p-4 
        bg-[#0d0d0d]
        "
      >
        <p
          className="
          text-[9px]
          uppercase 
          tracking-[3px] 
          text-gray-500
          "
        >
          Recent Placement
        </p>

        <div
          className="
          flex 
          justify-between 
          items-center 
          gap-3
          mt-3
          "
        >
          <p
            className="
            text-white 
            text-xs sm:text-sm
            font-lato
            line-clamp-1
            "
          >
            {data?.latestListing?.title}
          </p>

          <p
            className="
            text-[#c9a227]
            text-xs sm:text-sm
            font-medium
            font-playfair
            whitespace-nowrap
            "
          >
            {data?.latestListing?.price?.amount}{" "}
            {data?.latestListing?.price?.currency}
          </p>
        </div>
      </div>

      {/* Contact */}
      <div
        className="
        flex 
        items-center 
        gap-3 
        mt-5
        "
      >
        <a
          href={`mailto:${user?.email}`}
          className="
          w-9 h-9 
          rounded-full 
          border border-[#5c4518]
          flex 
          items-center 
          justify-center
          text-gray-400
          hover:text-[#c9a227]
          transition
          "
        >
          <Mail size={15} />
        </a>

        <a
          href={`tel:${user?.phone}`}
          className="
          w-9 h-9 
          rounded-full 
          border border-[#5c4518]
          flex 
          items-center 
          justify-center
          text-gray-400
          hover:text-[#c9a227]
          transition
          "
        >
          <Phone size={15} />
        </a>
      </div>
    </div>
  );
}
