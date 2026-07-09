"use client";


import {
useSearchParams,
useRouter
}
from "next/navigation";

import {
useState
}
from "react";


import {
useAppDispatch
}
from "@/lib/redux/store/hook";


import {
resetPassword
}
from "@/lib/features/auth/authApi";




export default function ResetPassword(){



const params =
useSearchParams();


const router =
useRouter();


const dispatch =
useAppDispatch();



const token =
params.get("token");



const [password,setPassword] =
useState("");





const submit = async(
e:any
)=>{


e.preventDefault();



try{


await dispatch(
resetPassword({

newPassword:password,

token:token as string

})
).unwrap();



router.push("/login");



}
catch(err){


console.log(err);


}



}





return(


<section
className="
min-h-screen
bg-black
flex
items-center
justify-center
"
>



<form

onSubmit={submit}

className="
max-w-md
w-full
bg-white/5
border
border-yellow-500/20
rounded-3xl
p-10
space-y-6
"

>


<h2
className="
text-amber-400
text-3xl
text-center
"
>
Reset Password
</h2>



<input

type="password"

placeholder="New Password"


value={password}


onChange={
e=>setPassword(e.target.value)
}


className="
w-full
bg-transparent
border
border-amber-400/20
rounded-xl
p-3
text-white
"

/>




<button

type="submit"

className="
bg-amber-400
w-full
py-3
rounded-xl
text-black
"

>

Reset Password

</button>



</form>



</section>


)



}