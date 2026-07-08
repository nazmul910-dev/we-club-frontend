import {
 ApprovalStatus,
 AccountStatus,
 LicenseVerificationStatus
} from "@/constants/userStatus";


export interface IUser {

 _id:string;

 fullName:string;

 email:string;

 role:string;

 accessTo:string;

 licenseNumber:string;

 brokerage:string;

 phone:string;

 city:string;

 country:string;

 bio:string;


 approvalStatus:ApprovalStatus;

 accountStatus:AccountStatus;

 licenseVerificationStatus:LicenseVerificationStatus;


 paymentStatus:string;

 subscriptionStatus:string;


 lifetimeCommissionEarned:number;

 discretionScore:number;


 createdAt:string;

 updatedAt:string;

}