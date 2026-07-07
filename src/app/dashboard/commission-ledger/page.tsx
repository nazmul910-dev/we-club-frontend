"use client";


import CommissionHeader 
from "@/components/commission/commission-header";

import CommissionTabs 
from "@/components/commission/commission-tabs";

import CommissionTable 
from "@/components/commission/commission-table";



export default function CommissionLedgerPage(){


return(

<div
className="
min-h-screen
bg-[#090909]
px-6
py-10
"
>


<div
className="
max-w-7xl
mx-auto
"
>


<CommissionHeader/>


<CommissionTabs/>


<CommissionTable/>


</div>


</div>


)

}