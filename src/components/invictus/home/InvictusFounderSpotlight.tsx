"use client";

import Image from "next/image";
import { Star } from "lucide-react";



export default function InvictusFounderSpotlight({Title,Name,designation,Month,description,voice,image}:any) {
  return (
    <section className="space-y-4">
      <div>
        <p className="font-montserrat text-[10px] tracking-[0.3em] text-[#9E7B28] uppercase">
          SPOTLIGHT
        </p>

        <h2 className="font-playfair text-3xl text-[#1C1814]">
          {Title}
        </h2>
      </div>

      <div className="grid md:grid-cols-2 overflow-hidden rounded-2xl border border-[#DECDB0] bg-white shadow-xs">
        {/* Image */}
        <div className="relative min-h-[320px] bg-[#1C1814]">
          <Image
            src={image}
            alt="Founder"
            fill
            className="object-cover object-[center_0%]"
          />

          <div className="absolute top-4 left-4 rounded-full bg-[#C9A84C] px-4 py-1">
            <span className="flex items-center gap-2 font-montserrat text-[10px] font-bold tracking-widest">
              <Star size={12} />
              {Month}
            </span>
          </div>
        </div>

        {/* Content */}

        <div className="p-8 flex flex-col justify-center space-y-5">
          <div>
            <p className="font-montserrat text-[10px] tracking-[0.3em] text-[#9E7B28]">
              MEMBER OF THE MONTH
            </p>

            <h3 className="font-playfair text-3xl mt-2">{Name}</h3>

            <p className="font-montserrat text-xs tracking-widest text-[#9E7B28]">
              {designation}
            </p>
          </div>

          <blockquote className="border-l-2 border-[#C9A84C] pl-4 font-playfair italic text-lg text-[#5C5348]">
            {`${voice}`}
          </blockquote>

          <p className="font-montserrat text-sm text-[#6B6358] leading-relaxed">
            {description}
          </p>

          {/* <button
            className="
          w-fit
          rounded-md
          border
          border-[#9E7B28]
          px-5
          py-2
          font-montserrat
          text-xs
          font-bold
          tracking-widest
          text-[#9E7B28]
          hover:bg-[#9E7B28]
          hover:text-white
          transition
          "
          >
            VIEW FOUNDER PROFILE →
          </button> */}
        </div>
      </div>
    </section>
  );
}
