import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <Link href="/login">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Go to Login
            </button>
        </Link>
    </div>
  );
}
