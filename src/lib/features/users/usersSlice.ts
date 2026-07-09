import {
createSlice
} from "@reduxjs/toolkit";


import {
getAllUsers,
updateApprovalStatus,
updateLicenseStatus,
updateAccountStatus
}
from "./usersApi";


import {
IUser
}
from "@/types/user-managemetn";




interface State{

users:IUser[];

loading:boolean;

error:string|null;

}



const initialState:State={

users:[],

loading:false,

error:null

};





const usersSlice=createSlice({

name:"users",

initialState,


reducers:{},



extraReducers:(builder)=>{


builder



// GET USERS


.addCase(
getAllUsers.pending,
(state)=>{

state.loading=true;

}
)



.addCase(
getAllUsers.fulfilled,
(state,action)=>{

state.loading=false;

state.users=action.payload;

}
)



.addCase(
getAllUsers.rejected,
(state,action)=>{

state.loading=false;

state.error=
action.payload ?? null;

}
)





// APPROVAL UPDATE


.addCase(
updateApprovalStatus.fulfilled,
(state,action)=>{


const index =
state.users.findIndex(
u=>u._id===action.payload._id
);


if(index!==-1){

state.users[index]=action.payload;

}


}

)






// LICENSE UPDATE


.addCase(
updateLicenseStatus.fulfilled,
(state,action)=>{


const index =
state.users.findIndex(
u=>u._id===action.payload._id
);


if(index!==-1){

state.users[index]=action.payload;

}


}

)






// ACCOUNT UPDATE


.addCase(
updateAccountStatus.fulfilled,
(state,action)=>{


const index =
state.users.findIndex(
u=>u._id===action.payload._id
);


if(index!==-1){

state.users[index]=action.payload;

}


}

)




}


});



export default usersSlice.reducer;