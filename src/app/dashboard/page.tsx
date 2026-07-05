"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
        <Link href="/login">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Go to 2nd page
            </button>
        </Link>
    </div>
  );
}
