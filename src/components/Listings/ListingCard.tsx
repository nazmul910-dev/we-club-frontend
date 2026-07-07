import { Bath, Bed, MapPin, Maximize2, Share2 } from "lucide-react";
import ListingsPromoteModal from "./ListingsPromoteModal";
import { promoteRequestApi } from "@/lib/features/PromoteRequest/promoteRequestApi";
import { AppDispatch } from "@/lib/redux/store/store";
import { useDispatch } from "react-redux";

export const ListingCard = ({ property }: { property: any }) => {
  const dispatch = useDispatch<AppDispatch>();

  console.log(property._id)
  return (
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

          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-ui text-[10px] tracking-[0.2em] uppercase text-white/50`}
          >
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
        <h3
          className="font-display text-white text-xl truncate"
          title={property.title}
        >
          {property.title}
        </h3>

        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          {property.location?.city}, {property.location?.state},{" "}
          {property.location?.region}
        </p>

        {/* Specs */}
        <div className="mt-4 flex items-center gap-5 font-ui text-[11px] text-foreground/80">
          <span className="flex items-center gap-1.5 text-white/70">
            <Bed className="h-3.5 w-3.5 text-gold" strokeWidth={1.5} />
            {property.bedrooms}
          </span>
          <span className="flex items-center gap-1.5 text-white/70">
            <Bath className="h-3.5 w-3.5 text-gold" strokeWidth={1.5} />
            {property.bathrooms}
          </span>
          <span className="flex items-center gap-1.5 text-white/70">
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
          <ListingsPromoteModal
            listingId={property._id}
            onSubmit={async (payload) => {

            
              await dispatch(
                promoteRequestApi.createPromoteRequest(payload),
              ).unwrap();
            }}
          />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold-soft text-white/80 hover:border-gold hover:text-gold transition duration-200 cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
