"use client";

import {useState} from "react";
import {Pencil} from "lucide-react";

import ProfileImageModal from "./profile-image-modal";
import Link from "next/link";
import {LockKeyhole} from "lucide-react";

export default function ProfileHeaderCard({
profile
}:any){


const [open,setOpen]=useState(false);



return(

<>


<div
className="
border
border-[#302718]
rounded-xl
bg-[#111]
p-6
flex
justify-between
items-center
"
>


<div className="flex items-center gap-5">


<div className="relative">


{
profile.profileImage?


<img 
src={profile.profileImage}
className="
w-20
h-20
rounded-full
border
border-[#C9A962]
object-cover
"
/>


:

<div
className="
w-20
h-20
rounded-full
border
border-[#C9A962]
flex
items-center
justify-center
text-[#C9A962]
text-xl
font-semibold
uppercase
bg-[#1a160f]
"
>

{
profile.fullName
?.split(" ")
.map((name:string)=>name[0])
.join("")
.slice(0,2)
}

</div>

}



<button

onClick={()=>setOpen(true)}

className="
absolute
bottom-0
right-0
bg-[#C9A962]
text-black
rounded-full
p-1
"

>

<Pencil size={12}/>

</button>


</div>





<div>

<h2
className="
text-3xl
text-white
font-serif
"
>
{profile.fullName}
</h2>


<span
className="
text-[#7bd0a4]
text-xs
uppercase
tracking-widest
"
>

{profile.role}

</span>
 
 

</div>



</div>

<Link

href="/dashboard/profile/change-password"

className="
flex
items-center
gap-2
border
border-[#C9A962]
px-4
py-2
rounded-lg
text-[#C9A962]
text-sm
"

>

<LockKeyhole size={15}/>

Change Password

</Link>

</div>



<ProfileImageModal
open={open}
close={()=>setOpen(false)}
/>


</>


)

}