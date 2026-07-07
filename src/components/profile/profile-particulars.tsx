"use client";


import {useState} from "react";

import {UserProfile} from "@/lib/features/profile/profileSlice";

import ProfileField from "./profile-field";

import ProfileEditModal from "./profile-edit-modal";


export default function ProfileParticulars({
profile
}:{
profile:UserProfile
}){


const [open,setOpen]=useState(false);



return(

<div>


<div
className="
border
border-[#302718]
rounded-xl
bg-[#111]
p-6
"
>


<h3
className="
text-[#C9A962]
text-xs
tracking-[3px]
mb-6
"
>

PARTICULARS

</h3>



<div
className="
grid
md:grid-cols-2
gap-5
">


<ProfileField
label="Full Name"
value={profile.fullName}
onEdit={()=>setOpen(true)}
/>


<ProfileField
label="Title"
value={profile.role}
/>


<ProfileField
label="Email"
value={profile.email}
/>


<ProfileField
label="Phone"
value={profile.phone}
onEdit={()=>setOpen(true)}
/>


<ProfileField
label="Based In"
value={
`${profile.city || ""}, ${profile.country || ""}`
}
onEdit={()=>setOpen(true)}
/>


<ProfileField
label="Brokerage"
value={profile.brokerage}
onEdit={()=>setOpen(true)}
/>



</div>


</div>



<ProfileEditModal
open={open}
close={()=>setOpen(false)}
profile={profile}
/>



</div>


)

}