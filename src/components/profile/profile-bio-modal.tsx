"use client";


import {useState} from "react";
import {X} from "lucide-react";

import {useAppDispatch} from "@/lib/redux/store/hook";

import {
updateBio
} from "@/lib/features/profile/profileApi";



interface Props{

open:boolean;

close:()=>void;

bio:string;

}



export default function ProfileBioModal({
open,
close,
bio
}:Props){



const dispatch=useAppDispatch();



const [value,setValue]=useState(bio);



if(!open)
return null;



const save=()=>{


dispatch(
updateBio({
bio:value
})
);


close();


}



return(

<div
className="
fixed
inset-0
bg-black/70
z-50
flex
items-center
justify-center
"
>


<div
className="
bg-[#111]
border
border-[#302718]
rounded-xl
w-full
max-w-lg
p-6
"
>


<div
className="
flex
justify-between
mb-5
"
>

<h2
className="
text-white
text-2xl
font-serif
"
>
Edit Biography
</h2>


<button
onClick={close}
className="text-white"
>

<X/>

</button>


</div>




<textarea

value={value}

onChange={
e=>setValue(e.target.value)
}

rows={6}

className="
w-full
bg-[#0d0d0d]
border
border-[#302718]
rounded-md
p-4
text-white
resize-none
outline-none
"

/>



<button

onClick={save}

className="
mt-5
w-full
bg-[#C9A962]
text-black
py-3
rounded-md
text-xs
tracking-widest
uppercase
"

>

Save Biography

</button>



</div>


</div>


)

}