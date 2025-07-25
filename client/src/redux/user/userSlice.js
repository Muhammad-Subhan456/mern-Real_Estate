import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        signInStart : (state) =>{
            state.loading = true;
        },
        signInSuccess : (state,action) =>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure : (state,action) =>{
            state.error = action.payload,
            state.loading = false;
        },
        updateUser: (state,action) => {
            state.currentUser = action.payload
        },
        updateUserStart: (state) =>{
            state.loading = true;
        },
        updateUserSuccess:(state,action) =>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateUserFailure: (state,action) =>{
            state.error = action.payload;
            state.loading = false;
        },
        deleteUserStart: (state) =>{
            state.loading = true;
        },
        deleteUserSuccess: (state) =>{
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure: (state,action) =>{
            state.error = action.payload;
            state.loading = false;
        },
        signOutStart: (state) =>{
            state.loading = true;
        },
        signOutSuccess: (state) =>{
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        signOutFailure: (state,action) =>{
            state.error = action.payload;
            state.loading = false;
        },

    }
});

export const {signInStart,signInFailure,signInSuccess,updateUser
    ,updateUserFailure,updateUserStart,updateUserSuccess,deleteUserFailure,deleteUserStart,deleteUserSuccess,
 signOutFailure,signOutStart,signOutSuccess } = userSlice.actions;

export default userSlice.reducer;