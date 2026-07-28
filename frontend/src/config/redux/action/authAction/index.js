// import { clientServer } from "@/config";
import { clientServer } from "../../../index";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
    "user/login",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer('/login', {
                email: user.email,
                password: user.password
            });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            } else {
                return thunkAPI.rejectWithValue({
                    message: "token not provided"
                })
            }
            return thunkAPI.fulfillWithValue(response.data.token);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }

)


export const userSignup = createAsyncThunk(
    "user/register",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer('/register', {
                email: user.email,
                password: user.password,
                username: user.username,
                name: user.name
            });

            return thunkAPI.fulfillWithValue(response.data);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)

export const getAboutUser = createAsyncThunk(
    "user/getaboutUserandProfile",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.get("/get_User_and_Profile", {
                params: {
                    token: user.token
                }
            })

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)

export const getAllUser = createAsyncThunk(
    "user/getAllUser",
    async (_, thunkAPI) => {
        try {
            const response = await clientServer.get("/get_All_User_Profile");

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)