"use client";

import { Search } from "lucide-react";


interface Props{
 value:string;
 onChange:(value:string)=>void;
}


export default function NetworkSearch({
 value,
 onChange,
}:Props){


return (

<div className="w-full">

<div className="relative">

<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"/>


<input

type="text"

value={value}

onChange={(e)=>onChange(e.target.value)}

placeholder="Search name, address, company or listing..."

className="w-full h-12 rounded-lg bg-[#0d0d0d] border border-[#6d531c] pl-11 pr-4 text-sm text-white placeholder:text-gray-500 outline-none focus:border-[#c9a227] transition"

 />

</div>

</div>

)

}