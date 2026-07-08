import api from "@/lib/api/api";
import {createAsyncThunk} from "@reduxjs/toolkit";

import {
 IUser
} from "./user.types";



export const getAllUsers = createAsyncThunk<
 IUser[],
 void,
 {
 rejectValue:string
}

>(


"usersManagement/getAllUsers",


async(_, {rejectWithValue})=>{


try{


const res = await api.get(
"/users"
);


return res.data.data;


}catch(error:any){


return rejectWithValue(
 error?.response?.data?.message ||
 "Failed to fetch users"
);


}


}



);





export const updateApprovalStatus = createAsyncThunk<

IUser,

{
id:string;
data:{
approvalStatus:string;
}
},

{
rejectValue:string
}

>(


"usersManagement/updateApprovalStatus",


async(payload,{rejectWithValue})=>{


try{


const res = await api.patch(

`/admin/users/${payload.id}/approval-status`,

payload.data

);


return res.data.data;


}catch(error:any){

return rejectWithValue(
error?.response?.data?.message ||
"Update failed"
);

}


}


);







export const updateLicenseStatus = createAsyncThunk<

IUser,

{
id:string;
data:{
licenseVerificationStatus:string;
}
},

{
rejectValue:string
}

>(


"usersManagement/updateLicenseStatus",


async(payload,{rejectWithValue})=>{


try{


const res = await api.patch(

`/admin/users/${payload.id}/license-verification-status`,

payload.data

);


return res.data.data;


}catch(error:any){

return rejectWithValue(
error?.response?.data?.message ||
"Update failed"
);

}


}


);







export const updateAccountStatus = createAsyncThunk<

IUser,

{
id:string;
data:{
accountStatus:string;
}
},

{
rejectValue:string
}

>(


"usersManagement/updateAccountStatus",


async(payload,{rejectWithValue})=>{


try{


const res = await api.patch(

`/admin/users/${payload.id}/account-status`,

payload.data

);


return res.data.data;


}catch(error:any){

return rejectWithValue(
error?.response?.data?.message ||
"Update failed"
);

}


}


);