import { clientServer } from "../../../index";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const getAllPosts = createAsyncThunk(
    "post/createPost",
    async (_, thunkAPI) => {
        try {
            const response = await clientServer('/getAllPosts')

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)