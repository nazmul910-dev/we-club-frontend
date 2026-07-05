"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { listingsApi } from "@/lib/features/listings/listingsApi";
import { AppDispatch, RootState } from "@/lib/redux/store/store";
import { Bath, Bed, MapPin, Maximize2, Plus, Share2 } from "lucide-react";

interface Property {
  ref: string;
  status: "Active" | "Pending" | "Sold";
  statusBg: string;
  statusDot: string;
  askingPrice: string;
  title: string;
  location: string;
  image: string;
  beds: number;
  baths: number;
  area: string;
  commission: string;
}

const PROPERTIES: Property[] = [
  {
    ref: "WE-2401",
    status: "Active",
    statusBg: "bg-role-ambassador/15 border-role-ambassador/55 text-[#7BD0A4]",
    statusDot: "bg-[#7BD0A4]",
    askingPrice: "€14,500,000",
    title: "Villa Crépuscule",
    location: "Cap Ferrat, Côte d'Azur, France",
    image: "/assets/property-1-CVIhYrLl.jpg",
    beds: 7,
    baths: 9,
    area: "1,140 m²",
    commission: "2.5%",
  },
  {
    ref: "WE-2402",
    status: "Pending",
    statusBg: "bg-status-pending/15 border-status-pending/45 text-[#FFB07A]",
    statusDot: "bg-[#FFB07A]",
    askingPrice: "$28,900,000",
    title: "The Meridian Penthouse",
    location: "Tribeca, New York, NY",
    image: "/assets/property-2-BgaNISZ5.jpg",
    beds: 5,
    baths: 6,
    area: "780 m²",
    commission: "3%",
  },
  {
    ref: "WE-2403",
    status: "Active",
    statusBg: "bg-role-ambassador/15 border-role-ambassador/55 text-[#7BD0A4]",
    statusDot: "bg-[#7BD0A4]",
    askingPrice: "€8,250,000",
    title: "Domaine des Cyprès",
    location: "Lourmarin, Provence, France",
    image: "/assets/property-3-MKFLxTq2.jpg",
    beds: 9,
    baths: 11,
    area: "1,820 m²",
    commission: "2%",
  },
  {
    ref: "WE-2404",
    status: "Sold",
    statusBg: "bg-white/5 border-white/20 text-muted-foreground",
    statusDot: "bg-muted-foreground",
    askingPrice: "$19,400,000",
    title: "Casa Lumen",
    location: "Tulum, Quintana Roo, Mexico",
    image: "/assets/property-4-C9Vx6WYg.jpg",
    beds: 6,
    baths: 7,
    area: "920 m²",
    commission: "3.5%",
  },
  {
    ref: "WE-24010",
    status: "Sold",
    statusBg: "bg-white/5 border-white/20 text-muted-foreground",
    statusDot: "bg-muted-foreground",
    askingPrice: "$19,400,000",
    title: "Casa Lumen",
    location: "Tulum, Quintana Roo, Mexico",
    image: "/assets/property-4-C9Vx6WYg.jpg",
    beds: 6,
    baths: 7,
    area: "920 m²",
    commission: "3.5%",
  },
  {
    ref: "WE-24040",
    status: "Sold",
    statusBg: "bg-white/5 border-white/20 text-muted-foreground",
    statusDot: "bg-muted-foreground",
    askingPrice: "$19,400,000",
    title: "Casa Lumen",
    location: "Tulum, Quintana Roo, Mexico",
    image: "/assets/property-4-C9Vx6WYg.jpg",
    beds: 6,
    baths: 7,
    area: "920 m²",
    commission: "3.5%",
  }
];


export default function MyListingsPage() {

  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((s: RootState) => {

    return s.listings;
  });




  useEffect(() => {
    dispatch(listingsApi.getListings());
  }, [dispatch]);


  console.log("Listings from Redux Store:", items );


  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col gap-8 bg-[#0a0a0a] min-h-[calc(100vh-4rem)]">
      {/* Header Section */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-eyebrow mb-2">Inventory · Discreet</div>
          <h1 className="font-display text-3xl md:text-4xl text-white">My Listings</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Properties presented under your name or shared from the platform.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            type="button"
            className="rounded-full border border-gold-soft px-4 py-2 font-ui text-[11px] tracking-[0.2em] uppercase text-foreground hover:border-gold hover:text-gold transition duration-200 cursor-pointer"
          >
            Filter
          </button>
          
          <button 
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2 font-ui text-[11px] tracking-[0.22em] uppercase text-primary-foreground font-medium transition hover:brightness-110 duration-200 cursor-pointer"
          >
            <Plus size={14} strokeWidth={2.5} />
            Add Listing
          </button>
        </div>
      </div>

      {/* Grid of Listings */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
        {items.map((property) => (
          <article 
            key={property.ref_code}
            className=" card-luxe flex flex-col overflow-hidden"
          >
            {/* Card Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <img 
                src={property.cover_image} 
                alt={property.title} 
                loading="lazy" 
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              {/* Badges */}
              <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
                <span className="rounded-sm bg-gold px-2.5 py-1 font-ui text-[10px] tracking-[0.2em] uppercase text-primary-foreground">
                  Ref · {property.ref_code}
                </span>
                
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-ui text-[10px] tracking-[0.2em] uppercase text-white/50`}>
                  <span className={`h-1.5 w-1.5 rounded-full text`} />
                  {property.status}
                </span>
              </div>
              
              {/* Overlay with Asking Price */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent p-4 pt-12">
                <div className="text-meta text-white/50">Asking</div>
                <div className="mt-0.5 font-display  text-white text-2xl">
                  {property.price.amount} {property.price.currency}
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-display text-white text-xl truncate" title={property.title}>
                {property.title}
              </h3>
              
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                {property.location?.city}, {property.location?.state}, {property.location?.region}
              </p>

              {/* Specs */}
              <div className="mt-4 flex items-center gap-5 font-ui text-[11px] text-foreground/80">
                <span className="flex items-center gap-1.5">
                  <Bed className="h-3.5 w-3.5 text-gold" strokeWidth={1.5} />
                  {property.bedrooms}
                </span>
                <span className="flex items-center gap-1.5">
                  <Bath className="h-3.5 w-3.5 text-gold" strokeWidth={1.5} />
                  {property.bathrooms}
                </span>
                <span className="flex items-center gap-1.5">
                  <Maximize2 className="h-3.5 w-3.5 text-gold" strokeWidth={1.5} />
                  {property.area_sqm}
                </span>
              </div>

              {/* Commission */}
              <div className="mt-5 rounded-md border border-gold/45 bg-gold/8 px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="font-ui text-[10px] tracking-[0.2em] uppercase text-gold">
                    Referral Commission Offered
                  </span>
                  <span className="font-display text-lg text-gold">
                    {property.referral_commission?.offered_amount}%
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex items-center gap-2 pt-1">
                <button 
                  type="button"
                  className="flex-1 rounded-full border border-gold/60 bg-transparent px-3 py-2 font-ui text-[10px] tracking-[0.22em] uppercase text-gold hover:bg-gold/10 transition duration-200 cursor-pointer text-center"
                >
                  Request to Promote
                </button>
                
                <button 
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold-soft text-white/80 hover:border-gold hover:text-gold transition duration-200 cursor-pointer"
                >
                  <Share2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
