"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";


interface Props {

  onApproval:(status:string)=>void;

  onLicense:(status:string)=>void;

  onAccount:(status:string)=>void;

}



export default function StatusDropdown({
  onApproval,
  onLicense,
  onAccount
}:Props){


  const [open,setOpen]=useState(false);



  return (

    <div className="relative">


      <button
        type="button"
        onClick={()=>setOpen(!open)}
        className="p-2 rounded-lg text-yellow-400 hover:bg-yellow-500/10 transition"
      >

        <MoreVertical size={20}/>

      </button>



      {
        open && (

          <div className="absolute right-0 top-10 z-50 w-52 bg-[#111] border border-yellow-500/20 rounded-xl shadow-xl p-2">


            <button
              type="button"
              onClick={()=>{
                onApproval("approved");
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-white hover:bg-white/10 transition"
            >
              Approve User
            </button>



            <button
              type="button"
              onClick={()=>{
                onApproval("rejected");
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-white/10 transition"
            >
              Reject User
            </button>



            <button
              type="button"
              onClick={()=>{
                onLicense("verified");
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-green-400 hover:bg-white/10 transition"
            >
              Verify License
            </button>



            <button
              type="button"
              onClick={()=>{
                onAccount("active");
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-yellow-400 hover:bg-white/10 transition"
            >
              Activate Account
            </button>



            <button
              type="button"
              onClick={()=>{
                onAccount("suspended");
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-white/10 transition"
            >
              Suspend Account
            </button>


          </div>

        )
      }


    </div>

  );

}