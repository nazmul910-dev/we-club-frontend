"use client";


interface Props{

status:string;

}


export default function UserStatusBadge({
status
}:Props){


const color =
status==="approved" ||
status==="verified" ||
status==="active"
?
"border-green-500 text-green-400 bg-green-500/10"
:
status==="rejected" ||
status==="suspended"
?
"border-red-500 text-red-400 bg-red-500/10"
:
"border-yellow-500 text-yellow-400 bg-yellow-500/10";



return(

<span
className={`
px-3
py-1
rounded-full
text-xs
uppercase
border
${color}
`}
>

{status.replace("_"," ")}

</span>

)


}