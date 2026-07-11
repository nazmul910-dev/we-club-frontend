export interface DashboardStats {
  total_listings: number;
  listing_value: number;
  listing_views: number;
  total_promoters: number;
  properties_shared_with_me: number;
  commission_pipeline: number;
}

export interface ITopPromoter{

    user_id:string;
    fullName:string;
    profileImage?:string;
    city?:string;
    country?:string;
    totalViews:number;

}