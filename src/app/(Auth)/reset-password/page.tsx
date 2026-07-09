import { Suspense } from "react";

import ResetPassword from "./ResetPassword";


export default function Page(){


return (

<Suspense
fallback={
<div
className="
min-h-screen
bg-black
flex
items-center
justify-center
text-white
"
>
Loading...
</div>
}
>

<ResetPassword/>

</Suspense>

);


}