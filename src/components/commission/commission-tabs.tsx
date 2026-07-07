"use client";


import {useDispatch,useSelector} from "react-redux";
import {changeTab} from "@/lib/features/commissionLedger/commissionLedgerSlice";


const tabs=[
"all",
"pending",
"confirmed",
"paid",
"disputed"
];


export default function CommissionTabs(){


const dispatch=useDispatch();


const active=
useSelector(
(state:any)=>state.commission.tab
);



return(

<div className="
border
border-[#332b18]
rounded-xl
bg-[#111]
px-4
py-3
mb-6
flex
gap-8
"
>


{
tabs.map(tab=>(


<button
key={tab}

onClick={()=>dispatch(changeTab(tab))}


className={`
uppercase
text-xs
tracking-[3px]
transition

${
active===tab
?
"text-black bg-[#C9A962] px-5 py-2 rounded-full"
:
"text-[#777]"
}

`}
>


{tab}


</button>


))

}


</div>

)

}