import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { createPost, getAllPosts } from '../../config/redux/action/postAction';
import { getAboutUser } from '../../config/redux/action/authAction';
import UserLayout from '../../layout/userLayout';
import NavbarComponent from '../../Components/Navbar';
import styles from "./style.module.css";
import DashboardLayout from '../../layout/DashboardLayout';
import { BASE_URL } from '../../config/index.js';
import TextField from '@mui/material/TextField';


export default function DashboardComponent() {


    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth)

    const router = useRouter();


    useEffect(() => {
        if (authState.istheretoken) {
            dispatch(getAllPosts())
            dispatch(getAboutUser({ token: localStorage.getItem('token') }))

            if (!authState.all_profiles_fetched) {
                dispatch(getAllUser());
            }
        }
    }, [authState.isTokenThere])


    const [postContent, setPostContent] = useState("");
    const [fileContent, setFileContent] = useState();

    const handleUpload = async () => {
        dispatch(createPost({ file: fileContent, body: postContent }));
        setPostContent("")
        setFileContent(null)
    }

    if (authState.user) {
        return (

            <UserLayout>
                <DashboardLayout>
                    <div className={styles.scrollContainer}>
                        <div className={styles.createPostContainer}>
                            <img className={styles.userProfile} style={{ width: 100 }} src={`${BASE_URL}/${authState.user.userId}`}></img>
                            <TextField fullWidth label="What's in your mind? " className={styles.textArea} margin="normal" />
                            <label htmlFor="fileupload">
                                <div className={styles.fab}>
                                    <i className="fa-solid fa-plus"></i>
                                </div>
                            </label>
                            <input onChange={(e) => setFileContent(e.target.value[0])} type='file' hidden id="fileupload"></input>
                        </div>
                    </div>

                </DashboardLayout>
            </UserLayout>
        )
    } else {
        return (
            <UserLayout>
                <DashboardLayout>
                    <h1>Loading</h1>
                </DashboardLayout>
            </UserLayout>
        )
    }
}
