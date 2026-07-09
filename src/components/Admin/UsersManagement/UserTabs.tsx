"use client";

interface Props {
  active: string;
  setActive: (value: string) => void;
}


const tabs = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Approved",
    value: "approved",
  },
  {
    label: "Verified",
    value: "verified",
  },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Rejected",
    value: "rejected",
  },
];


export default function UserTabs({
  active,
  setActive,
}: Props) {


  return (

    <div className="flex gap-3 w-auto border border-yellow-500/20 bg-[#111] rounded-xl p-2 mb-6 overflow-x-auto">


      {
        tabs.map((tab) => (

          <button

            key={tab.value}

            type="button"

            onClick={() => setActive(tab.value)}

            className={`px-5 py-2 rounded-full text-xs uppercase tracking-widest whitespace-nowrap transition ${
              active === tab.value
                ? "bg-white text-black"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}

          >

            {tab.label}

          </button>

        ))
      }


    </div>

  );

}