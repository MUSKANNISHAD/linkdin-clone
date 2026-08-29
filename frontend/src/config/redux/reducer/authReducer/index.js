import { createSlice } from "@reduxjs/toolkit";
import { loginUser, userSignup, getAboutCurrentUser, getAllUser } from "../../action/authAction";
import { getConnectionRequest, getMyConnectionsRequest } from "../../action/authAction";

const initialState = {
    user: undefined,
    isError: false,
    isSuccess: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    isTokenThere: false,
    profileFetched: false,
    connections: [],
    connectionRequest: [],
    all_users: [],
    all_profiles_fetched: false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: () => initialState,
        handleLoginUser: (state) => {
            state.message = "hello"
        },
        emptyMessage: (state) => {
            state.message = ""
        },
        setIsTokenThere: (state) => {
            state.isTokenThere = true
        },
        setIsTokenNotThere: (state) => {
            state.isTokenThere = false
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true,
                    state.message = "wait for a momment"
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false,
                    state.isSuccess = true,
                    state.message = "logged in User",
                    state.loggedIn = true,
                    state.user = action.payload
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false,
                    state.isSuccess = false,
                    state.isError = true,
                    state.loggedIn = false,
                    state.message = "couldn't loggedin"
                // state.message = action.payload.message
            })
            .addCase(userSignup.pending, (state) => {
                state.isLoading = true,
                    state.message = "Registering you"
            })
            .addCase(userSignup.fulfilled, (state, action) => {
                state.isLoading = false,
                    state.isSuccess = true,
                    state.message = {
                        message: "Registration is susccessful, please loggedin"
                    }
                state.loggedIn = false,
                    state.user = action.payload
            })
            .addCase(userSignup.rejected, (state, action) => {
                    state.isLoading = false,
                    state.isSuccess = false,
                    state.isError = true,
                    state.loggedIn = false,
                    state.message = action.payload.message
            })
            .addCase(getAboutCurrentUser.fulfilled, (state, action) => {
                state.isError = false,
                    state.isLoading = false,
                    state.profileFetched = true,
                    state.user = action.payload.profile
            })
            .addCase(getAllUser.fulfilled, (state, action) => {
                state.isError = false,
                    state.isLoading = false,
                    state.all_profiles_fetched = true,
                    state.all_users = action.payload.Profiles
            })
            .addCase(getConnectionRequest.fulfilled, (state, action) => {
                state.connections = action.payload
            })
            .addCase(getConnectionRequest.rejected, (state, action) => {
                state.message = action.payload
            })
            .addCase(getMyConnectionsRequest.fulfilled, (state, action) => {
                state.connectionRequest = action.payload
            })
            .addCase(getMyConnectionsRequest.rejected, (state, action) => {
                state.message = action.payload
            })

    }
})

export const { reset, emptyMessage, setIsTokenNotThere, setIsTokenThere } = authSlice.actions;
export default authSlice.reducer;