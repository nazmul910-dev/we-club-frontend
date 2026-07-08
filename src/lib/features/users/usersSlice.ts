import {
createSlice
} from "@reduxjs/toolkit";


import {
IUser
} from "./user.types";


import {
getAllUsers,
updateApprovalStatus,
updateLicenseStatus,
updateAccountStatus
} from "./usersApi";



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




const usersManagementSlice=createSlice({

name:"usersManagement",

initialState,


reducers:{},



extraReducers:(builder)=>{


builder


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
action.payload || "Error";

}
)





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


export default usersManagementSlice.reducer;