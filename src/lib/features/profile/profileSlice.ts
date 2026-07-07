import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
getMyProfile,
updateBasicProfile,
updateBio,
updateSocialLink,
deleteSocialLink,
updateMarketingChannels,
updateProfileImage,
deleteProfileImage
} from "./profileApi";


export interface Profile {

_id:string;

fullName:string;
email:string;

role:string;
accessTo:string;

licenseNumber?:string;

brokerage?:string;
phone?:string;

city?:string;
country?:string;

bio?:string;

profileImage?:string;


socialLinks?:{
linkedin?:string;
facebook?:string;
twitter?:string;
instagram?:string;
website?:string;
};


marketingChannels?:string[];


accountStatus:string;

approvalStatus:string;

paymentStatus:string;

subscriptionStatus:string;


lifetimeCommissionEarned:number;

discretionScore:number;


createdAt:string;

}


export type UserProfile = Profile;

interface State{

profile:Profile|null;

loading:boolean;

error:string|null;

}


const initialState:State={

profile:null,

loading:false,

error:null

};



const profileSlice=createSlice({

name:"profile",

initialState,


reducers:{


clearProfile:(state)=>{

state.profile=null;

}


},



extraReducers:(builder)=>{


builder


.addCase(getMyProfile.pending,(state)=>{
state.loading=true;
})


.addCase(
getMyProfile.fulfilled,
(state,action:PayloadAction<Profile>)=>{

state.loading=false;

state.profile=action.payload;

}
)


.addCase(getMyProfile.rejected,(state,action)=>{

state.loading=false;

state.error=action.payload as string;

})



.addCase(
updateBasicProfile.fulfilled,
(state,action)=>{

state.profile=action.payload;

}
)


.addCase(
updateBio.fulfilled,
(state,action)=>{

state.profile=action.payload;

}
)


.addCase(
updateSocialLink.fulfilled,
(state,action)=>{

state.profile=action.payload;

}
)


.addCase(
deleteSocialLink.fulfilled,
(state,action)=>{

state.profile=action.payload;

}
)


.addCase(
updateMarketingChannels.fulfilled,
(state,action)=>{

state.profile=action.payload;

}
)


.addCase(
updateProfileImage.fulfilled,
(state,action)=>{

state.profile=action.payload;

}
)



.addCase(
deleteProfileImage.fulfilled,
(state,action)=>{

state.profile=action.payload;

}
)


}

});



export const {
clearProfile
}=profileSlice.actions;


export default profileSlice.reducer;