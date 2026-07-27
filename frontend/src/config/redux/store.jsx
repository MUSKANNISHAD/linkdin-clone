import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";

//   steps for State-Management:-
//** submit-action 
// **handle that action in it's reducer 
//** */ then register the reducer in => reducer



export const store = configureStore({
    reducer: {
        auth: authReducer,
        post: postReducer
    }
})