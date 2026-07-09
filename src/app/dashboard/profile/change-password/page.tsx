"use client";

import Image from "next/image";

import BgImage from "@/assets/Login/login-bg.jpg";

import ChangePassword from "@/components/Auth/login/ChangePassword";


export default function ChangePasswordPage() {


return (

<section
className="
relative
flex
items-center
justify-center
h-[80vh]
overflow-hidden
px-5
"
>






<div
className="
absolute
top-0
left-1/2
h-96
w-96
-translate-x-1/2
rounded-full
bg-yellow-500/10
blur-[180px]
"
/>





<div
className="
relative
z-10
w-full
max-w-lg
rounded-3xl
border
border-yellow-500/20
bg-white/5
backdrop-blur-[8px]
p-8
md:p-10
shadow-2xl
"
>


<ChangePassword/>


</div>



</section>

);

}