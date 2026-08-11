"use client";

import { useEffect, useState } from "react";
import { getTotalMyCommssions } from "@/lib/features/commissionLedger/commissionLedgerApi";
import { UserProfile } from "@/lib/features/profile/profileSlice";
import { useAppDispatch } from "@/lib/redux/store/hook";
import { calculateTenure } from "@/utils/date";
import { formatCompactNumber } from "@/lib/utils/format-number";

export default function ProfileStanding({
  profile,
}: {
  profile: UserProfile;
}) {
  const dispatch = useAppDispatch();

  const [totalCommission, setTotalCommission] = useState<number>(0);
  const [commissionLoading, setCommissionLoading] = useState(true);
  const totalCom= formatCompactNumber(totalCommission)
  useEffect(() => {
    const fetchTotalCommission = async () => {
      try {
        setCommissionLoading(true);

        const response = await dispatch(
          getTotalMyCommssions(),
        ).unwrap();

        setTotalCommission(
          response.data.total_final_commission ?? 0,
        );
      } catch (error) {
        console.error(
          "Failed to fetch total commission:",
          error,
        );

        setTotalCommission(0);
      } finally {
        setCommissionLoading(false);
      }
    };

    fetchTotalCommission();
  }, [dispatch]);

  const data = [
    [
      "TENURE",
      calculateTenure(profile.createdAt),
    ],

    [
      "LIFETIME COMMISSION",
      commissionLoading
        ? "Loading..."
        : `$${totalCom}`,
    ],

    [
      "DISCRETION SCORE",
      profile.discretionScore || "Add",
    ],
  ];

  return (
    <div
      className="
        border
        border-[#302718]
        rounded-xl
        bg-[#111]
        p-6
        h-fit
      "
    >
      <h3
        className="
          text-[#C9A962]
          text-xs
          tracking-[3px]
          mb-6
        "
      >
        STANDING
      </h3>

      {data.map((item) => (
        <div
          key={item[0]}
          className="
            flex
            justify-between
            py-5
            border-b
            border-[#302718]
          "
        >
          <span
            className="
              text-[#777]
              text-xs
              tracking-widest
            "
          >
            {item[0]}
          </span>

          <span className="text-white">
            {item[1]}
          </span>
        </div>
      ))}
    </div>
  );
}