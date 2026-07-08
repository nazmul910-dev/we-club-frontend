"use client";


import { useEffect, useMemo, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";

import { listingsApi } from "@/lib/features/listings/listingsApi";


import NetworkHeader from "@/components/Network/NetworkHeader";
import NetworkSearch from "@/components/Network/NetworkSearch";
import NetworkToolbar from "@/components/Network/NetworkToolbar";
import NetworkCard from "@/components/Network/NetworkCard";
import NetworkListItem from "@/components/Network/NetworkListItem";



export default function NetworkDirectoryPage() {


  const dispatch = useAppDispatch();



const {
  adminListings,
  adminListingsLoading
} = useAppSelector(
  state => state.listings
);



  const [search, setSearch] = useState("");

  const [layout, setLayout] = useState<
    "grid" | "list"
  >("grid");





  useEffect(() => {


    dispatch(
      listingsApi.getAllListingsForAdmin({
        page: 1,
        limit: 100,
        status: "active"
      })
    );


  }, [dispatch]);






const activeListings = useMemo(() => {

  const active = adminListings.filter(
    (item:any) => item.status === "active"
  );


  const groupedListings = new Map();


  active.forEach((item:any)=>{


    const userId = item.associate_id?._id;


    if(!userId) return;



    if(!groupedListings.has(userId)){


      groupedListings.set(userId, {

        ...item,

        totalActiveListings: 1,

        latestListing: item,

      });


    } else {


      const existing = groupedListings.get(userId);



      existing.totalActiveListings += 1;



      if(
        new Date(item.created_at) >
        new Date(existing.latestListing.created_at)
      ){

        existing.latestListing = item;

      }


    }


  });



  return Array.from(groupedListings.values());


},[adminListings]);





  const filteredListings = useMemo(() => {


    const value = search
      .toLowerCase()
      .trim();



    if (!value)
      return activeListings;




    return activeListings.filter(
      (item: any) => {


        const user = item.associate_id;



        return (

          item.latestListing?.title
            ?.toLowerCase()
            .includes(value)


          ||

          user?.fullName
            ?.toLowerCase()
            .includes(value)


          ||

          user?.city
            ?.toLowerCase()
            .includes(value)


          ||

          user?.country
            ?.toLowerCase()
            .includes(value)


          ||

          user?.brokerage
            ?.toLowerCase()
            .includes(value)

        );

      }

    );


  }, [
    search,
    activeListings
  ]);







  return (

    <div className="min-h-screen bg-black px-6 py-10 md:px-10">


      <div className="max-w-7xl mx-auto">


        <NetworkHeader />



        <div className="mt-8">


          <NetworkSearch

            value={search}

            onChange={setSearch}

          />


        </div>





        <NetworkToolbar

          count={filteredListings.length}

          layout={layout}

          setLayout={setLayout}

        />





        {
          adminListingsLoading  ? (

            <div className="text-center py-20 text-gray-400">
              Loading network members...
            </div>

          )

            :

            filteredListings.length === 0 ? (

              <div className="border border-[#5c4518] rounded-xl py-20 text-center">

                <p className="text-gray-400">
                  No network members found
                </p>

              </div>

            )


              :

              layout === "grid" ? (


                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">


                  {
                    filteredListings.map(
                      (item: any) => (


                        <NetworkCard

                          key={item._id}

                          data={item}

                        />


                      )

                    )

                  }


                </div>



              )

                :



                <div className="space-y-4">


                  {
                    filteredListings.map(
                      (item: any) => (


                        <NetworkListItem

                          key={item._id}

                          data={item}

                        />


                      )

                    )

                  }


                </div>


        }




      </div>


    </div>


  )

}