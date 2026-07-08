export interface NetworkUser {
  _id:string;
  fullName:string;
  profileImage?:string;
  city:string;
  country:string;
  phone:string;
  email:string;
  brokerage:string;
}


export interface NetworkListing {

 _id:string;

 title:string;

 status:
 "active" |
 "pending" |
 "sold" |
 "draft";


 price:{
   amount:number;
   currency:string;
 };


 associate_id:NetworkUser;

}