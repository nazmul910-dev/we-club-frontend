export interface Commission {

_id:string;

status:
| "pending"
| "confirmed"
| "paid"
| "disputed";

currency:string;

estimated_commission_amount:number;

created_at:string;

listing_id?:{

title:string;

ref_code:string;

price:{
amount:number;
currency:string;
}

};

promoter_id:{

_id:string;

fullName:string;

email:string;

role:string;

};

dispute?:{

reason:string;

opened_at:string;

opened_by:string;

};

}