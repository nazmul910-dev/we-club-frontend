import {createSlice} from "@reduxjs/toolkit";


interface State{

tab:
"all"
|"pending"
|"confirmed"
|"paid"
|"disputed";

}


const initialState:State={

tab:"all"

};



const slice=createSlice({

name:"commission",

initialState,

reducers:{


changeTab:(state,action)=>{

state.tab=action.payload;

}


}

});



export const {
changeTab
}=slice.actions;


export default slice.reducer;