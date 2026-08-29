import { clientServer } from "../../../index";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async (_, thunkAPI) => {
        try {
            const response = await clientServer.get('/get_All_Posts')

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)

// export const createPost = createAsyncThunk(
//     "post/createPosts",
//     async (userdata, thunkAPI) => {
//         try {
//             const formData = new FormData();
//             formData.append('token', localStorage.getItem('token'));
//             formData.append('body', body);
//             formData.append('media', file);

//             const response = await clientServer.post('/post', formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data"
//                 }
//             })

//             if (response.status === 200) {
//                 return thunkAPI.fulfillWithValue("post Uploaded");
//             } else {
//                 return thunkAPI.rejectWithValue("post not uploaded");
//             }

//         } catch (err) {
//             return thunkAPI.rejectWithValue(err.response.data);
//         }
//     }

// )


export const createPost = createAsyncThunk(
    "post/createPosts",
    async ({ file, body }, thunkAPI) => {
        try {
            const formData = new FormData();

            formData.append("token", localStorage.getItem("token"));
            formData.append("body", body);
            formData.append("media", file);

            const response = await clientServer.post("/post", formData);

            if (response.status === 200) {
                return thunkAPI.fulfillWithValue("post Uploaded");
            } else {
                return thunkAPI.rejectWithValue("post not uploaded");
            }

        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || err.message
            );
        }
    }
);



export const deletePost = createAsyncThunk(
    async (post_id, thunkAPI) => {
        try {
            const response = await clientServer.deletePost('/deletePost', {
                data: {
                    token: localStorage.getItem("token"),
                    post_id: post_id.post_id
                }

            })
            return thunkAPI.fulfillWithValue(response.data);


        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)

export const incrementPostlikes = createAsyncThunk(
    "post/incrementLike",
    async (post, thunkAPI) => {
        try {
            const response = await clientServer.post('/post/increment', {
                post_id: post.post_id
            })

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data.message);
        }
    }
)


export const getCommentsById = createAsyncThunk(
    "posts/getAllcomments",
    async (postData, thunkAPI) => {
        try {
            const response = await clientServer.get('/get_comments_by_post', {
                params: {
                    post_id: postData.post_id
                }
            });
            return thunkAPI.fulfillWithValue({
                comments: response.data,
                post_id: postData.post_id
            })

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)


export const postComment = createAsyncThunk(
    "post/postComment",
    async (commentData, thunkAPI) => {
        try {
            console.log({
                post_id: commentData.post_id,
                body: commentData.body
            })
            const response = await clientServer.post("./postComment", {
                token: localStorage.getItem("token"),
                commentBody: commentData.body,
                post_id: commentData.post_id

            })

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)