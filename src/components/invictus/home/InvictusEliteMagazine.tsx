"use client";

import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import img1 from "@/assets/Invictus/Home/sof1.png"


const issues = [
  {
    img: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80",
    number: "N°13",
    title: "The Quiet Empire",
  },
  {
    img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80",
    number: "N°12",
    title: "Legacy & Leverage",
  },
  {
    img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
    number: "N°11",
    title: "The Art of The Climb",
  },
  {
    img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
    number: "N°10",
    title: "Cities of Elite",
  },
  {
    img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
    number: "N°09",
    title: "Built To Last",
  },
  {
    img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
    number: "N°09",
    title: "Built To Last",
  },
  {
    img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
    number: "N°09",
    title: "Built To Last",
  },
  {
    img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
    number: "N°09",
    title: "Built To Last",
  },
];

export default function InvictusEliteMagazine() {
  return (
    <section className="space-y-5">
      <div>
        <p
          className="
font-montserrat
text-[10px]
tracking-[0.35em]
text-[#9E7B28]
uppercase
"
        >
          THE ÉLITE MAGAZINE
        </p>

        <h2
          className="
font-playfair
text-3xl
text-[#1C1814]
"
        >
          The Élite Magazine
        </h2>
      </div>

      <div
        className="
overflow-hidden
rounded-2xl
border
border-[#DECDB0]
bg-white
shadow-sm
"
      >
        <div
          className="
grid
md:grid-cols-2
"
        >
          {/* MAIN IMAGE */}

          <div
            className="
relative
min-h-[420px]
overflow-hidden
group
"
          >
            <Image
              src={img1}
              alt="Magazine"
              fill
              className="

transition
object-cover
duration-700
group-hover:scale-105
"
            />
          </div>

          {/* CONTENT */}

          <div
            className="
p-8
flex
flex-col
justify-center
space-y-5
"
          >
            <p
              className="
font-montserrat
text-[10px]
tracking-[0.35em]
text-[#9E7B28]
"
            >
              THE ÉLITE MAGAZINE
            </p>

            <p
              className="
font-montserrat
text-[10px]
tracking-widest
text-gray-400
"
            >
              ISSUE N°14 · JULY 2026
            </p>

            <h3
              className="
font-playfair
italic
text-4xl
text-[#1C1814]
"
            >
              The Borderless Operator
            </h3>

            <p
              className="
font-montserrat
text-sm
leading-relaxed
text-[#6B6358]
"
            >
              This month's issue features long-form conversations with World
              Elite CEOs building without borders — how they structure their
              days, their portfolios, and their teams.
            </p>

            <div className="grid lg:flex gap-3">
              <button
                className="
cursor-pointer
rounded-md
bg-[#C9A84C]
px-6
py-3
font-montserrat
text-xs
font-bold
tracking-widest
transition-all
duration-300
hover:-translate-y-1
hover:shadow-lg
hover:bg-[#B89435]
"
              >
                READ NOW →
              </button>

              <button
                className="
cursor-pointer
rounded-md
border
border-[#C9A84C]
px-6
py-3
font-montserrat
text-xs
font-bold
tracking-widest
text-[#9E7B28]
transition-all
duration-300
hover:bg-[#9E7B28]
hover:text-white
hover:-translate-y-1
"
              >
                ORDER PRINT EDITION →
              </button>
            </div>
          </div>
        </div>

        {/* PAST ISSUES */}

        <div
          className="
border-t
border-[#DECDB0]
p-6
"
        >
          <div
            className="
flex
justify-between
items-center
mb-5
"
          >
            <p
              className="
font-montserrat
text-[10px]
tracking-[0.35em]
text-[#9E7B28]
"
            >
              PAST ISSUES
            </p>

            <span
              className="
font-montserrat
text-[10px]
tracking-widest
text-gray-400
"
            >
              SWIPE →
            </span>
          </div>

          <Swiper
            modules={[Autoplay]}
            spaceBetween={18}
            slidesPerView={2}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 3,
              },

              1024: {
                slidesPerView: 5,
              },
            }}
            className="premium-swiper"
          >
            {issues.map((issue) => (
              <SwiperSlide key={issue.title}>
                <div
                  className="
group
cursor-pointer
transition-all
duration-500
hover:-translate-y-2
"
                >
                  <div
                    className="
relative
h-[170px]
overflow-hidden
rounded-lg
border
border-[#E8DDCA]
shadow-sm
"
                  >
                    <Image
                      src={issue.img}
                      alt={issue.title}
                      fill
                      className="
object-cover
transition
duration-700
group-hover:scale-110
"
                    />

                    <div
                      className="
absolute
inset-0
bg-black/0
transition
duration-500
group-hover:bg-black/20
"
                    />
                  </div>

                  <p
                    className="
mt-3
font-montserrat
text-[9px]
tracking-widest
text-[#9E7B28]
"
                  >
                    {issue.number}
                  </p>

                  <h4
                    className="
font-playfair
text-sm
text-[#1C1814]
group-hover:text-[#9E7B28]
transition
"
                  >
                    {issue.title}
                  </h4>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
