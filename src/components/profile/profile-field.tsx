import {Pencil} from "lucide-react";


interface Props{

label:string;

value?:string;

onEdit?:()=>void;

}


export default function ProfileField({
label,
value,
onEdit
}:Props){


return(

<div>


<div className="
flex
justify-between
mb-2
">


<span
className="
text-[11px]
tracking-[3px]
text-[#777]
uppercase
"
>

{label}

</span>



{
onEdit &&

<button
onClick={onEdit}
className="text-[#C9A962]"
>

<Pencil size={14}/>

</button>

}



</div>



<div
className="
h-12
border
border-[#302718]
rounded-md
bg-[#0d0d0d]
px-4
flex
items-center
text-white
text-sm
"
>


{
value
?
value
:
<span className="text-[#777]">
Add
</span>
}


</div>


</div>


)

}