"use client";


import {
Mail,
Phone,
MapPin,
Eye
} from "lucide-react";


import Avatar from "./Avatar";
import { late } from "zod/v3";


interface Props{

data:any;

}


export default function NetworkListItem({
data
}:Props){


const user=data.user;

const latestListing = data.listings[0];

console.log(latestListing)

return (

<div className="flex items-center justify-between border border-[#5c4518] bg-[#090909] rounded-xl p-5 hover:border-[#c9a227] transition">


<div className="flex items-center gap-5">


<Avatar
image={user?.profileImage}
name={user?.fullName || "User"}
/>



<div>


<h3 className="text-white font-semibold">
{user?.fullName}
</h3>



<div className="flex items-center gap-2 text-xs text-gray-500 mt-1">

<MapPin size={12}/>

{user?.city}, {user?.country}

</div>



<p className="text-xs text-gray-500 mt-1">

{user?.brokerage}

</p>


</div>


</div>





<div className="hidden md:block">


<p className="text-[10px] uppercase tracking-[3px] text-gray-500">
Listing
</p>


<p className="text-white text-sm mt-1">

{latestListing.listing_title}

</p>


</div>





<div className="text-right">


<p className="text-[#c9a227] text-sm">

{latestListing?.listing_price} EUR

</p>



<div className="flex gap-2 mt-3 justify-end">

<a href={`tel:${user?.phone}`} className="w-8 h-8 rounded-full border border-[#5c4518] flex items-center justify-center text-gray-400">

<Eye size={14}/>

</a>
<a href={`mailto:${user?.email}`} className="w-8 h-8 rounded-full border border-[#5c4518] flex items-center justify-center text-gray-400">

<Mail size={14}/>

</a>



<a href={`tel:${user?.phone}`} className="w-8 h-8 rounded-full border border-[#5c4518] flex items-center justify-center text-gray-400">

<Phone size={14}/>

</a>




</div>


</div>



</div>


)

}