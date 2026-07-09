"use client";


import { IUser } from "@/types/user-managemetn";


interface Props{

user:IUser|null;

close:()=>void;

}



export default function UserDetailsModal({
user,
close
}:Props){


if(!user) return null;



return(

<div
className="
fixed
inset-0
bg-black/70
flex
items-center
justify-center
z-50
"
>


<div
className="
w-full
max-w-lg
bg-[#111]
border
border-yellow-500/20
rounded-2xl
p-6
"
>


<div className="
flex
justify-between
">

<h2
className="
text-2xl
text-yellow-400
font-serif
"
>
User Details
</h2>


<button
onClick={close}
className="
text-white/50
"
>
✕
</button>


</div>



<div className="
mt-6
space-y-3
text-sm
"
>


<Info title="Name" value={user.fullName}/>

<Info title="Email" value={user.email}/>

<Info title="Role" value={user.role}/>

<Info title="Access" value={user.accessTo}/>

<Info title="Phone" value={user.phone}/>

<Info title="Country" value={user.country}/>

<Info title="License" value={user.licenseNumber}/>

<Info title="Brokerage" value={user.brokerage}/>


</div>



</div>


</div>


)

}



function Info({
title,
value
}:{
title:string;
value:string;
}){


return(

<div
className="
flex
justify-between
border-b
border-white/10
pb-2
"
>

<span
className="
text-white/40
"
>
{title}
</span>

<span
className="
text-white
"
>
{value || "-"}
</span>


</div>

)

}