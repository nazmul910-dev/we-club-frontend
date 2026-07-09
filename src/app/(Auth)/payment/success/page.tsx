import { Suspense } from "react";

import PaymentSuccessPage from "./PaymentSuccessPage";


export default function Page(){


return (

<Suspense
fallback={
<div
className="
relative
flex
min-h-screen
items-center
justify-center
bg-black
text-white
"
>
Verifying payment...
</div>
}
>

<PaymentSuccessPage/>

</Suspense>

);


}