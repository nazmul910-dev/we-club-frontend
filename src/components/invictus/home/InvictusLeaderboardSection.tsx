"use client";

import { fetchInvictusLeaderboard } from "@/lib/features/leaderboard/leaderboardSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { Trophy, Globe } from "lucide-react";
import { useEffect } from "react";

const challenge = [
    {
        name: "Nathalie Rousseau",
        country: "FR",
        score: "2,840",
    },
    {
        name: "David Chen",
        country: "CA",
        score: "2,710",
    },
    {
        name: "Alexander Marchetti",
        country: "IT",
        score: "2,605",
    },
];

const referrals = [
    {
        name: "Sofia Marchetti",
        
        country: "IT",
        value: "$412K",
    },
    {
        name: "Carlos Vega",
        country: "MX",
        value: "$298K",
    },
    {
        name: "Adam Koubi",
        country: "FR",
        value: "$276K",
    },
];

function Ranking({ data }: any) {
    return (
        <div className="space-y-4">
            {data.map((item: any, index: number) => (
                <div
                    key={item.name}
                    className="flex items-center justify-between border-b border-[#E8DDCA] pb-3"
                >
                    <div className="flex gap-3 items-center">
                        <div className="h-8 w-8 rounded-full bg-[#E9DDC7] flex items-center justify-center text-xs">
                            {index + 1}
                        </div>

                        <div>
                            <p className="font-montserrat text-sm font-semibold">
                                {item.name}{" "}
                                <span className="text-gray-400">
                                    {item.country}
                                </span>
                            </p>
                        </div>
                    </div>

                    <strong className="font-playfair">
                        {item.score || item.value}
                    </strong>
                </div>
            ))}
        </div>
    );
}

export default function InvictusLeaderboardSection() {
    const dispatch = useAppDispatch();
    const entries = useAppSelector((state) => state.leaderboard.entries ?? []);
    const isLoading = useAppSelector((state) => state.leaderboard.isLoading);
    console.log("entities", entries);
    

    useEffect(() => {
        dispatch(fetchInvictusLeaderboard({page :1, limit: 3 }));
    }, [dispatch]);

    return (
        <section className="space-y-4">
            <p className="font-montserrat text-[10px] tracking-[0.3em] text-[#9E7B28]">
                THIS MONTH
            </p>

            <h2 className="font-playfair text-3xl">Leaderboard</h2>

            <div className="rounded-2xl bg-[#FAF6EE] p-8 grid md:grid-cols-2 gap-10">
                <div>
                    <div className="flex gap-3 items-center mb-5">
                        <Trophy className="text-[#9E7B28]" />
                        <h3 className="font-playfair text-xl">
                            INVICTUS Challenge
                        </h3>
                    </div>

                    <Ranking data={challenge} />
                </div>

                <div>
                    <div className="flex gap-3 items-center mb-5">
                        <Globe className="text-[#9E7B28]" />
                        <h3 className="font-playfair text-xl">
                            World Elite Referrals
                        </h3>
                    </div>

                    <Ranking data={referrals} />
                </div>
            </div>
        </section>
    );
}
