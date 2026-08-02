import { createSlice } from "@reduxjs/toolkit";
// import { reset } from "../authReducer";
import { getAllComments, getAllPosts, postComment } from "../../action/postAction";


const initialState = {
    posts: [],
    isError: false,
    postFetched: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    postId: "",
    Comments: []
}

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        reset: () => initialState,
        resetPostId: (state) => {
            state.postId = ""
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllPosts.pending, (state) => {
                state.isLoading = true,
                    state.message = "fetching all posts.."
            })
            .addCase(getAllPosts.fulfilled, (state, action) => {
                state.isError = true,
                    state.isLoading = false,
                    state.posts = action.payload.posts.reverse(),
                    state.postFetched = true
            })
            .addCase(getAllPosts.rejected, (state, action) => {
                state.isError = true,
                    state.isLoading = false,
                    state.message = action.payload
            })
            .addCase(getAllComments.fulfilled, (state, action) => {
                state.postId = action.payload.postId
            })
            

    }
})

export const { resetPostId } = postSlice.actions;
export default postSlice.reducer;