"use client";


import {useState} from "react";
import {useAppDispatch} from "@/lib/redux/store/hook";
import {forgotPassword} from "@/lib/features/auth/authApi";
import Link from "next/link";


export default function ForgetPassword(){


const dispatch=useAppDispatch();

const [email,setEmail]=useState("");

const [message,setMessage]=useState("");



const submit=async(e:any)=>{

e.preventDefault();


try{

await dispatch(
forgotPassword({
email
})
).unwrap();


setMessage(
"Reset link sent to your email"
);


}catch(err:any){

setMessage(err);

}


}




return(

<section className="
min-h-screen
flex
items-center
justify-center
bg-black
">


<form
onSubmit={submit}
className="
w-full
max-w-md
rounded-3xl
border
border-yellow-500/20
bg-white/5
backdrop-blur
p-10
space-y-6
"
>


<h2 className="
text-center
text-3xl
text-amber-400
">
Forgot Password
</h2>



<input

type="email"

placeholder="Email"

value={email}

onChange={
e=>setEmail(e.target.value)
}

className="
w-full
rounded-xl
border
border-amber-400/20
bg-transparent
px-4
py-3
text-white
"
/>



<button
className="
w-full
rounded-xl
bg-amber-400
py-3
font-semibold
text-black
"
>

Send Reset Link

</button>


{
message &&
<p className="text-center text-white">
{message}
</p>
}



<Link
href="/login"
className="
block
text-center
text-amber-400
"
>
Back Login
</Link>



</form>


</section>


)

}