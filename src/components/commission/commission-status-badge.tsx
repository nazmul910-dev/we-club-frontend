interface Props{
 status:string;
}


export default function CommissionStatusBadge({
status
}:Props){


const styles:any={

pending:
"border-orange-500/40 text-orange-400 bg-orange-500/10",

confirmed:
"border-blue-500/40 text-blue-400 bg-blue-500/10",

paid:
"border-green-500/40 text-green-400 bg-green-500/10",

disputed:
"border-red-500/40 text-red-400 bg-red-500/10",

};



return(

<span
className={`
px-3
py-1
rounded-full
border
text-[10px]
tracking-[2px]
uppercase
${styles[status]}
`}
>

{status}

</span>

)

}