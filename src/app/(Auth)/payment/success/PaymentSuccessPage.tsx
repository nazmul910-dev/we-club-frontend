"use client";


import { useEffect } from "react";

import {
useSearchParams,
useRouter
}
from "next/navigation";

import axios from "axios";

import Image from "next/image";

import BgImage from "@/assets/Login/login-bg.jpg";



export default function PaymentSuccessPage() {


const searchParams =
useSearchParams();


const router =
useRouter();



useEffect(()=>{


const verify = async()=>{


const sessionId =
searchParams.get("session_id");



if(!sessionId){

return;

}



try {


await axios.get(
`https://we-club.onrender.com/api/v1/payments/verify-session/${sessionId}`
);

//https://we-club.onrender.com  http://localhost:5000

router.push("/confirm-mail");



}
catch(error){

console.error(error);

}


};



verify();



},[router,searchParams]);





return (

<div
className="
relative
flex
min-h-screen
items-center
justify-center
overflow-hidden
"
>


<Image
src={BgImage}
alt="Background"
fill
priority
className="
absolute
inset-0
object-cover
"
/>



<div
className="
relative
z-20
flex
h-52
w-52
items-center
justify-center
rounded-2xl
border
border-amber-600/20
bg-transparent
backdrop-blur-[3px]
md:h-100
md:w-100
"
>


<h2
className="
text-center
text-xl
font-bold
text-white
font-playfair
md:text-2xl
"
>
Verifying your payment...
</h2>


</div>


</div>

);


}