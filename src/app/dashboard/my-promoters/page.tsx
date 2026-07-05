"use client";

import { useState } from "react";
import { Phone, Mail, Download, Eye, Forward, Trash2 } from "lucide-react";

interface Promoter {
  id: string;
  initials: string;
  name: string;
  phone: string;
  email: string;
  value: string;
  listingsCount: number;
}

const INITIAL_PROMOTERS: Promoter[] = [
  {
    id: "1",
    initials: "HM",
    name: "Hugo Marchetti",
    phone: "+377 97 70 12 04",
    email: "h.marchetti@privee.mc",
    value: "€48.2M",
    listingsCount: 6,
  },
  {
    id: "2",
    initials: "SO",
    name: "Sienna Okonkwo",
    phone: "+44 20 7946 0091",
    email: "sienna@okonkwo.co",
    value: "£32.4M",
    listingsCount: 4,
  },
  {
    id: "3",
    initials: "KT",
    name: "Kenji Tanaka changed",
    phone: "+81 3 6840 9200",
    email: "k.tanaka@yamato.jp",
    value: "¥2.1B",
    listingsCount: 3,
  },
  {
    id: "4",
    initials: "AS",
    name: "Aarav Shankar",
    phone: "+91 22 6789 4500",
    email: "aarav@shankar.in",
    value: "₹98Cr",
    listingsCount: 5,
  },
];

export default function MyPromotersPage() {
  const [promoters, setPromoters] = useState<Promoter[]>(INITIAL_PROMOTERS);

  const handleRevoke = (id: string) => {
    // Ready for backend integration (e.g. axios.delete(`/api/promoters/${id}`))
    if (confirm("Are you sure you want to revoke this promoter's access?")) {
      setPromoters((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleDownloadAssets = (promoter: Promoter) => {
    alert(`Downloading assets package for ${promoter.name}...`);
  };

  const handleView = (promoter: Promoter) => {
    alert(`Viewing details for ${promoter.name}`);
  };

  const handleShare = (promoter: Promoter) => {
    alert(`Sharing promoter profile for ${promoter.name}`);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col gap-8 bg-[#0a0a0a] min-h-[calc(100vh-4rem)]">
      {/* Header Section */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-eyebrow mb-2">Operators · Trusted</div>
          <h1 className="font-display text-3xl md:text-4xl text-foreground">My Promoters</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            The hand-picked operators advancing your inventory across the network.
          </p>
        </div>
      </div>

      {/* Grid of Promoters */}
      {promoters.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-gold-soft rounded-lg bg-card/50">
          <p className="text-muted-foreground font-ui text-xs tracking-wider uppercase">No promoters added yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {promoters.map((promoter) => (
            <article 
              key={promoter.id}
              className="card-luxe p-6 flex flex-col justify-between"
            >
              <div>
                {/* Avatar and Basic Details */}
                <div className="flex items-start gap-4">
                  <div 
                    className="inline-flex items-center justify-center rounded-full border border-gold/40 bg-[#1A1A1A] font-ui font-medium text-gold shrink-0" 
                    style={{ width: "52px", height: "52px", fontSize: "18.72px" }}
                  >
                    {promoter.initials}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-xl text-foreground truncate">
                      {promoter.name}
                    </h3>
                    
                    <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-gold shrink-0" />
                        <span>{promoter.phone}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-gold shrink-0" />
                        <span className="truncate">{promoter.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-md border border-gold-soft bg-[#0E0E0E] px-3 py-2.5">
                    <div className="text-meta">Value of Listings</div>
                    <div className="mt-1 font-display text-lg text-foreground">
                      {promoter.value}
                    </div>
                  </div>
                  
                  <div className="rounded-md border border-gold-soft bg-[#0E0E0E] px-3 py-2.5">
                    <div className="text-meta">No. of Listings</div>
                    <div className="mt-1 font-display text-lg text-foreground">
                      {promoter.listingsCount}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div className="mt-5 flex items-center justify-between border-t border-gold-soft pt-4">
                <button
                  type="button"
                  onClick={() => handleDownloadAssets(promoter)}
                  className="flex items-center gap-2 font-ui text-[10px] tracking-[0.22em] uppercase text-gold hover:underline cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download Assets
                </button>

                <div className="flex items-center gap-1.5">
                  <button 
                    type="button"
                    aria-label="View" 
                    onClick={() => handleView(promoter)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gold-soft text-foreground/75 transition hover:border-gold hover:text-gold cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  {/* testing */}
                  <button 
                    type="button"
                    aria-label="Share" 
                    onClick={() => handleShare(promoter)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gold-soft text-foreground/75 transition hover:border-gold hover:text-gold cursor-pointer"
                  >
                    <Forward className="h-3.5 w-3.5" />
                  </button>
                  
                  <button 
                    type="button"
                    aria-label="Revoke" 
                    onClick={() => handleRevoke(promoter.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gold-soft text-foreground/75 transition hover:border-red-500 hover:text-[#E88A8A] cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
