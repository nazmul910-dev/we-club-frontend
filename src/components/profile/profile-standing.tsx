import {UserProfile} from "@/lib/features/profile/profileSlice";
import {calculateTenure} from "@/utils/date";

export default function ProfileStanding({
profile
}:{
profile:UserProfile
}){


const data=[

["TENURE",
calculateTenure(profile.createdAt)],

["LIFETIME COMMISSION",
`€${profile.lifetimeCommissionEarned}`],

["DISCRETION SCORE",
profile.discretionScore || "Add"]

];



return(

<div
className="
border
border-[#302718]
rounded-xl
bg-[#111]
p-6
h-fit
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

STANDING

</h3>



{
data.map(
(item)=>(

<div
key={item[0]}
className="
flex
justify-between
py-5
border-b
border-[#302718]
"
>


<span className="
text-[#777]
text-xs
tracking-widest
">

{item[0]}

</span>


<span className="text-white">

{item[1]}

</span>


</div>

)

)

}



</div>

)

}