import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "@/lib/api/api";
import axios from "axios";



const errorHandler=(error:any)=>{

if(axios.isAxiosError(error)){

return error.response?.data?.message || "Request failed";

}

return "Something went wrong";

};




// GET PROFILE

export const getMyProfile=createAsyncThunk(

"profile/get",

async(_,{rejectWithValue})=>{

try{

const res=await api.get("/profile/me");

return res.data.data;


}catch(error){

return rejectWithValue(errorHandler(error));

}

}

);




// BASIC UPDATE


export const updateBasicProfile=createAsyncThunk(

"profile/basic",

async(payload:any,{rejectWithValue})=>{

try{


const res=await api.patch(
"/profile/me/basic",
payload
);


return res.data.data;


}catch(error){

return rejectWithValue(errorHandler(error));

}


}

);




// BIO


export const updateBio=createAsyncThunk(

"profile/bio",

async(payload:{bio:string},{rejectWithValue})=>{


try{


const res=await api.patch(
"/profile/me/bio",
payload
);


return res.data.data;


}catch(error){

return rejectWithValue(errorHandler(error));

}


}

);





// SOCIAL LINK


export const updateSocialLink=createAsyncThunk(

"profile/social",

async(
payload:{
platform:string;
url:string;
},
{rejectWithValue}
)=>{


try{


const res=await api.patch(
"/profile/me/social-links",
payload
);


return res.data.data;


}catch(error){

return rejectWithValue(errorHandler(error));

}

}

);




// DELETE SOCIAL


export const deleteSocialLink=createAsyncThunk(

"profile/social/delete",

async(platform:string,{rejectWithValue})=>{


try{


const res=await api.delete(
`/profile/me/social-links/${platform}`
);


return res.data.data;


}catch(error){

return rejectWithValue(errorHandler(error));

}

}


);





// MARKETING CHANNEL


export const updateMarketingChannels=createAsyncThunk(

"profile/marketing",

async(
marketingChannels:string[],
{rejectWithValue}
)=>{


try{


const res=await api.patch(
"/profile/me/marketing-channels",
{
marketingChannels
}
);


return res.data.data;


}catch(error){

return rejectWithValue(errorHandler(error));

}


}

);






// IMAGE UPLOAD


export const updateProfileImage=createAsyncThunk(

"profile/image",

async(
file:File,
{rejectWithValue}
)=>{


try{


const formData=new FormData();

formData.append(
"profileImage",
file
);



const res=await api.patch(
"/profile/me/image",
formData,
{
headers:{
"Content-Type":"multipart/form-data"
}
}
);



return res.data.data;



}catch(error){

return rejectWithValue(errorHandler(error));

}


}

);





// DELETE IMAGE


export const deleteProfileImage=createAsyncThunk(

"profile/image/delete",

async(_,{rejectWithValue})=>{


try{


const res=await api.delete(
"/profile/me/image"
);


return res.data.data;


}catch(error){

return rejectWithValue(errorHandler(error));

}


}

);