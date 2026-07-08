"use client";


import {
Grid2X2,
List,
} from "lucide-react";


interface Props{

count:number;

layout:"grid"|"list";

setLayout:(value:"grid"|"list")=>void;

}


export default function NetworkToolbar({

count,

layout,

setLayout,

}:Props){



return (

<div className="flex items-center justify-between mt-8 mb-5">


<div>

<p className="text-[11px] tracking-[4px] uppercase text-[#c9a227]">
{count} Network Results
</p>

</div>



<div className="flex items-center gap-3">


<div className="flex items-center border border-[#6d531c] rounded-full overflow-hidden bg-[#0d0d0d]">


<button

onClick={()=>setLayout("list")}

className={`w-10 h-9 flex items-center justify-center transition ${layout==="list" ? "bg-[#c9a227] text-black":"text-gray-400"}`}

>

<List size={16}/>

</button>



<button

onClick={()=>setLayout("grid")}

className={`w-10 h-9 flex items-center justify-center transition ${layout==="grid" ? "bg-[#c9a227] text-black":"text-gray-400"}`}

>

<Grid2X2 size={16}/>

</button>


</div>


</div>


</div>

)

}