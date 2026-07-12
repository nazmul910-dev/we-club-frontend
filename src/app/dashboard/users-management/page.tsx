"use client";

import { useEffect } from "react";


import { redirect } from "next/navigation";
import {
useAppDispatch,
useAppSelector
}
from "@/lib/redux/store/hook";


import {
getAllUsers
}
from "@/lib/features/users/usersApi";


import UserHeader from "@/components/Admin/UsersManagement/UsersHeader";

import UsersTable from "@/components/Admin/UsersManagement/UsersTable";

export default function UsersManagementPage() {
  const dispatch = useAppDispatch();

  const users = useAppSelector((state) => state.users.users);

  const loading = useAppSelector((state) => state.users.loading);




const currentUser = useAppSelector(
  (state) => state.authUser?.user
);




useEffect(()=>{

dispatch(getAllUsers());

},[dispatch]);

if(
  currentUser &&
  !["admin","manager"].includes(currentUser.role)
){
  redirect("/dashboard");
}

if(loading){

return(

<div className="
text-white
p-10
"
      >
        Loading users...
      </div>
    );
  }

  return (
    <div
      className="
min-h-screen
w-full
bg-[#090909]
px-6
py-10
"
>


<div
className="

"
      >
        <UserHeader />

        <UsersTable users={users} />
      </div>
    </div>
  );
}
