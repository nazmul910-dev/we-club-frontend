"use client";

import { Crown, Infinity, Globe } from "lucide-react";

export default function InvictusNewGenBanner() {
  return (
    <section className="space-y-4">
      <div>
        <p className="font-montserrat text-[10px] tracking-[0.3em] text-[#9E7B28] uppercase">
          RISING
        </p>

        <h2 className="font-playfair text-2xl md:text-3xl text-[#1C1814]">
          The NewGen of Business Wo/Men
        </h2>
      </div>

      <div
        className="
        rounded-2xl
        bg-[#090909]
        p-6
        sm:p-8
        md:p-12
        text-white
        space-y-8
        "
      >
        {/* Top Heading */}

        <div className="text-center">
          <p
            className="
          font-montserrat
          text-[10px]
          tracking-[0.4em]
          text-[#C9A84C]
          "
          >
            THE MOMENT
          </p>

          <h3
            className="
            font-playfair
            italic
            text-3xl
            sm:text-4xl
            mt-3
            "
          >
            If not now, when?
          </h3>

          <p
            className="
          font-montserrat
          text-[10px]
          sm:text-xs
          tracking-[0.4em]
          mt-3
          text-gray-300
          "
          >
            JOIN THE WAITING LIST
          </p>
        </div>

        <div className="border-t border-[#5A4720]" />

        {/* Bottom Content */}

        <div
          className="
          flex
          flex-col
          lg:flex-row
          items-center
          justify-between
          gap-8
          "
        >
          <h4
            className="
            font-playfair
            text-2xl
            sm:text-3xl
            text-center
            lg:text-left
            "
          >
            Ready to become
            <br />
            the
            <span className="italic text-[#C9A84C]"> 3.0 version</span>
            <br />
            of yourself?
          </h4>

          {/* Right Side */}

          <div
            className="
            flex
            flex-col
            sm:flex-row
            items-center
            justify-center
            gap-6
            w-full
            lg:w-auto
            "
          >
            <div
              className="
              group
              text-center
              transition-all
              duration-300
              hover:-translate-y-1
              "
            >
              <Crown
                className="
                mx-auto
                text-[#C9A84C]
                transition-transform
                duration-300
                group-hover:scale-110
                "
              />

              <p className="text-[10px] tracking-widest mt-1">FEARLESS</p>
            </div>

            <div
              className="
              group
              text-center
              transition-all
              duration-300
              hover:-translate-y-1
              "
            >
              <Infinity
                className="
                mx-auto
                text-[#C9A84C]
                transition-transform
                duration-300
                group-hover:scale-110
                "
              />

              <p className="text-[10px] tracking-widest mt-1">LIMITLESS</p>
            </div>

            <div
              className="
              group
              text-center
              transition-all
              duration-300
              hover:-translate-y-1
              "
            >
              <Globe
                className="
                mx-auto
                text-[#C9A84C]
                transition-transform
                duration-300
                group-hover:scale-110
                "
              />

              <p className="text-[10px] tracking-widest mt-1">BORDERLESS</p>
            </div>

            <button
              className="
              cursor-pointer

              w-full
              sm:w-auto

              rounded-md

              bg-[#C9A84C]

              px-8
              py-3

              text-xs

              font-bold

              tracking-widest

              text-black

              transition-all
              duration-300

              hover:-translate-y-1

              hover:bg-[#B89435]

              hover:shadow-[0_10px_30px_rgba(201,168,76,0.35)]

              active:scale-95
              "
            >
              JOIN WAITING LIST →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
