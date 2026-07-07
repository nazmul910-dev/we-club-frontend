"use client";


import {useState} from "react";
import {X,Upload} from "lucide-react";

import {useAppDispatch} from "@/lib/redux/store/hook";

import {
updateProfileImage
} from "@/lib/features/profile/profileApi";



interface Props{

open:boolean;

close:()=>void;

}



export default function ProfileImageModal({
open,
close
}:Props){



const dispatch=useAppDispatch();


const [file,setFile]=useState<File|null>(null);



if(!open)
return null;



const uploadImage=()=>{


if(!file)
return;


dispatch(
updateProfileImage(file)
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
p-6
w-full
max-w-md
"
>



<div
className="
flex
justify-between
mb-6
"
>


<h2
className="
text-white
font-serif
text-2xl
"
>
Update Avatar
</h2>



<button
onClick={close}
>

<X
className="text-white"
/>

</button>


</div>




<label
className="
h-40
border
border-dashed
border-[#C9A962]
rounded-lg
flex
flex-col
items-center
justify-center
cursor-pointer
text-[#C9A962]
"
>


<Upload/>


<span className="mt-2 text-xs">
Choose Image
</span>



<input

type="file"

accept="image/*"

hidden

onChange={
e=>
setFile(
e.target.files?.[0] || null
)
}

/>


</label>




<button

onClick={uploadImage}

className="
mt-5
w-full
bg-[#C9A962]
text-black
py-3
rounded-md
uppercase
text-xs
tracking-widest
"

>

Upload

</button>



</div>



</div>


)

}