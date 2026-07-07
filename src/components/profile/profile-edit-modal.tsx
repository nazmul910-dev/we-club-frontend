"use client";


import {useState} from "react";

import {X} from "lucide-react";

import {useAppDispatch} from "@/lib/redux/store/hook";

import {
updateBasicProfile
} from "@/lib/features/profile/profileApi";



export default function ProfileEditModal({

open,
close,
profile

}:any){



const dispatch=useAppDispatch();



const [form,setForm]=useState({

fullName:profile.fullName || "",
brokerage:profile.brokerage || "",
phone:profile.phone || "",
city:profile.city || "",
country:profile.country || ""

});




if(!open)
return null;




const save=()=>{


dispatch(
updateBasicProfile(form)
);


close();


}



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
border-[#302718]
rounded-xl
p-6
"
>


<div
className="
flex
justify-between
mb-6
"
>

<h2 className="
text-white
text-2xl
font-serif
">

Edit Profile

</h2>



<button
onClick={close}
className="text-white"
>

<X/>

</button>


</div>



<div className="space-y-4">


{
Object.keys(form).map((key)=>(

<input

key={key}

value={(form as any)[key]}

onChange={(e)=>

setForm({

...form,

[key]:e.target.value

})

}

placeholder={key}

className="
w-full
bg-[#0d0d0d]
border
border-[#302718]
rounded-md
px-4
py-3
text-white
outline-none
"

/>

))

}


</div>




<button

onClick={save}

className="
mt-6
w-full
bg-[#C9A962]
text-black
py-3
rounded-md
uppercase
tracking-widest
text-xs
"

>

Save Changes

</button>



</div>


</div>

)

}