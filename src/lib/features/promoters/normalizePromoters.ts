import { Promoter } from "./promotersApi";

// NetworkCard/NetworkListItem were originally built against the OLD
// client-computed shape: { _id, associate_id: {...user}, totalActiveListings,
// latestListing: {...listing} }. Rather than rewrite those display
// components, this maps the new /promoters response onto that exact same
// shape — so NetworkCard and NetworkListItem don't need to change at all.
//
// ⚠️ FIELD NAMES BELOW ARE BEST-GUESS — confirm against the actual
// NetworkCard.tsx / NetworkListItem.tsx prop usage and adjust as needed.
export function normalizePromoterForDirectory(promoter: Promoter) {
  const user =
    typeof promoter.user_id === "object" && promoter.user_id !== null
      ? promoter.user_id
      : { _id: promoter.user_id };

  // Pick the most recently approved listing as "latest" — same logic the
  // old client-side grouping used (comparing created_at), just against
  // `approved_at` since that's what this materialized shape stores.
  const latest = [...(promoter.listings ?? [])].sort(
    (a, b) => new Date(b.approved_at).getTime() - new Date(a.approved_at).getTime()
  )[0];

  return {
    _id: promoter._id,
    associate_id: user,
    totalActiveListings: promoter.listings?.length ?? 0,
    profileViews: promoter.profile_views ?? 0,
    latestListing: latest
      ? {
          _id: latest.listing_id,
          title: latest.listing_title,
          // ⚠️ Sample data had no currency field alongside listing_price —
          // if NetworkCard expects `price.amount`/`price.currency`, adjust
          // this once currency is available; for now it's a raw number.
          price: latest.listing_price,
          status: latest.status,
          tier: latest.tier,
          created_at: latest.approved_at,
        }
      : null,
  };
}