import { createSlice } from "@reduxjs/toolkit";
import { loginUser, userSignup ,getAboutUser} from "../../action/authAction";

const initialState = {
    user: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    profileFetched: false,
    connections: [],
    connectionRequest: []
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
                    state.message = action.payload.message
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
                state.loggedIn = true,
                    state.user = action.payload
            })
            .addCase(userSignup.rejected, (state, action) => {
                state.isLoading = false,
                    state.isSuccess = false,
                    state.isError = true,
                    state.loggedIn = false,
                    state.message = action.payload.message
            })
            .addCase(getAboutUser.fulfilled, (state, action) => {
                state.isError = false,
                    state.isLoading = false,
                    state.profilefetched = true,
                    state.user = action.payload.profile
            })

    }
})

export const { reset, emptyMessage } = authSlice.actions;
export default authSlice.reducer;