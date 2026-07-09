import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import api from "@/lib/api/api";

import {
IUser,
ApprovalStatus,
AccountStatus,
LicenseVerificationStatus
} from "@/types/user-managemetn";



interface UsersResponse{

success:boolean;

message:string;

data:IUser[];

}




// GET ALL USERS

export const getAllUsers = createAsyncThunk<
IUser[],
void,
{rejectValue:string}
>(

"users/getAll",

async(_, {rejectWithValue})=>{


try{


const res = await api.get<UsersResponse>(
"/users"
);


return res.data.data;



}catch(error){


if(axios.isAxiosError(error)){

return rejectWithValue(
error.response?.data?.message ||
"Failed to load users"
)

}


return rejectWithValue(
"Something went wrong"
);


}


}

);





// UPDATE APPROVAL STATUS


export const updateApprovalStatus =
createAsyncThunk<

IUser,

{
id:string;
approvalStatus:ApprovalStatus;
rejectedReason?:string;

},

{
rejectValue:string
}

>(


"users/updateApproval",

async(payload,{rejectWithValue})=>{


try{


const res = await api.patch(
`/admin/users/${payload.id}/approval-status`,
{
approvalStatus:payload.approvalStatus,
rejectedReason:payload.rejectedReason
}
);


return res.data.data;



}catch(error){


if(axios.isAxiosError(error)){

return rejectWithValue(
error.response?.data?.message ||
"Approval update failed"
)

}


return rejectWithValue(
"Something went wrong"
)


}


}

);





// UPDATE LICENSE


export const updateLicenseStatus =
createAsyncThunk<

IUser,

{
id:string;
licenseVerificationStatus:LicenseVerificationStatus
},

{
rejectValue:string
}

>(


"users/updateLicense",

async(payload,{rejectWithValue})=>{


try{


const res = await api.patch(

`/admin/users/${payload.id}/license-verification-status`,

{
licenseVerificationStatus:
payload.licenseVerificationStatus
}

);


return res.data.data;



}catch(error){


if(axios.isAxiosError(error)){

return rejectWithValue(
error.response?.data?.message ||
"License update failed"
)

}


return rejectWithValue(
"Something went wrong"
)

}


}

);







// UPDATE ACCOUNT STATUS


export const updateAccountStatus =
createAsyncThunk<

IUser,

{
id:string;
accountStatus:AccountStatus
},

{
rejectValue:string
}

>(


"users/updateAccount",


async(payload,{rejectWithValue})=>{


try{


const res = await api.patch(

`/admin/users/${payload.id}/account-status`,

{
accountStatus:payload.accountStatus
}

);


return res.data.data;



}catch(error){


if(axios.isAxiosError(error)){

return rejectWithValue(
error.response?.data?.message ||
"Account update failed"
)

}


return rejectWithValue(
"Something went wrong"
)


}


}

);