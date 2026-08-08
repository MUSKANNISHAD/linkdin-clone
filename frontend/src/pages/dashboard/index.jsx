import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { createPost, getAllPosts, deletePost, incrementPostlikes, getAllComments } from '../../config/redux/action/postAction/index.js';
import { getAboutUser, getAllUser } from '../../config/redux/action/authAction/index.js';
import UserLayout from '../../layout/userLayout/index.jsx';
import NavbarComponent from '../../Components/Navbar/index.jsx';
import styles from "./style.module.css";
import DashboardLayout from '../../layout/DashboardLayout/index.jsx';
import { BASE_URL } from '../../config/index.js';
import TextField from '@mui/material/TextField';
import { resetPostId } from '../../config/redux/reducer/postReducer/index.js';


export default function DashboardComponent() {


    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    const postState = useSelector((state) => state.postReducer);
    const router = useRouter();

    const [isTokenThere, setIsTokenThere] = useState(false);

    const [postContent, setPostContent] = useState("");
    const [fileContent, setFileContent] = useState();
    const [postComment, setPostComment] = useState("");


    useEffect(() => {
        if (localStorage.getItem("token") === null) {
            router.push("/login");
        }
        setIsTokenThere(true);
    }, [])

    useEffect(() => {
        if (authState.isTokenThere) {
            dispatch(getAllPosts())
            dispatch(getAboutUser({ token: localStorage.getItem('token') }))

            if (!authState.all_profiles_fetched) {
                dispatch(getAllUser());
            }
        }
    }, [authState.isTokenThere])



    const handleUpload = async () => {
        await dispatch(createPost({ file: fileContent, body: postContent }));
        setPostContent("")
        setFileContent(null)
        dispatch(getAllPosts());
    }

    if (authState.user) {
        return (

            <UserLayout>
                <DashboardLayout>
                    <div className={styles.scrollContainer}>
                        <div className={styles.wrapper}>

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

                            <div className={styles.postsContainer}>

                                {/* {postState.posts && postState.posts.reverse().map((post) => {
                                    // {postState.post.map((post) => {
                                    // return (
                                    <div key={post._id} className={styles.singleCard}>

                                        <div className={styles.singleCard_profileContainer}>
                                            <img className={styles.userProfile} src={`${BASE_URL}/${authState.user.userId}`}></img>
                                            <div>
                                                <div style={{ display: "flex", gap: "1.2rem", justifyContent: "space-between", cursor: "pointer" }}>
                                                    <p style={{ fontWeight: "bold" }}>{post.userId.name}</p>
                                                    {
                                                        post.userId._id === authState.user.userId._ &&
                                                        <div onClick={async () => {
                                                            await dispatch(deletePost({ post_id: post_id }))
                                                            await dispatch(getAllPosts())
                                                        }}
                                                            style={{ cursor: "pointer" }}>
                                                            <i style={{ height: "1.4em", color: "red" }} className="fa-solid fa-trash">trash</i>
                                                        </div>
                                                    }

                                                </div>
                                                <p>style={{ color: "grey" }}{post.userId.username}</p>
                                                <p style={{ paddingTop: "1.3rem" }}>{post.body}</p>

                                                <div className={styles.singleCard_image}>
                                                    <img src={`${BASE_URL}/${post.media}`}></img>
                                                </div>

                                                <div onClick={async () => {
                                                    await dispatch(incrementPostlikes({ post_id: post_id }))
                                                    dispatch(getAllPosts())

                                                }}
                                                    className={styles.optionsContainer}>
                                                    <div className={styles.singleoptions_optionContainer}>
                                                        <i className="fa-solid fa-thumbs-up">likes</i>
                                                    </div>
                                                    <div onClick={() => {
                                                        dispatch(getAllComments({ post_id: post._id }))
                                                    }}
                                                        className={styles.singleoptions_optionContainer}>
                                                        <i className="fa-solid fa-comment-dots">commnets</i>
                                                    </div>
                                                    <div onClick={() => {
                                                        const text = encodeURIComponent(post.body)
                                                        const uri = encodeURIComponent("apnacollege.in");

                                                        const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                                                        window.open(twitterUrl, "_blank")
                                                    }}
                                                        className={styles.singleoptions_optionContainer}>
                                                        <i class="fa-solid fa-share-nodes">share</i>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    // )

                                })} */}
                            </div>

                        </div>
                    </div>

                    {
                        postState.postId !== "" &&
                        <div onClick={() => {
                            dispatch(resetPostId)
                        }}
                            className={styles.commentsContainer}>
                            <div onClick={(e) => {
                                e.stopPropagation()
                            }}
                                className={styles.allCommentsContainer}>
                                {postState.comments.length === 0 && <h2>No comments</h2>}


                                {postState.comments.length !== 0 &&
                                    <div>
                                        {postState.comments.map((comment, index) => {
                                            return (
                                                <div className={styles.singleComment} key={comment._id}>

                                                    <div className={styles.singleComment_profileContainer}>
                                                        <img src={`${BASE_URL}/${comment.userId.profilePicture}`} alt="profile-picture" />
                                                        <div>
                                                            <p style={{ fontWeight: "bold", fontSize: "1.2rem" }}>{comment.userId.name}</p>
                                                            <p>@{comment.userId.username}</p>
                                                        </div>
                                                    </div>

                                                    <p>
                                                        {comment.body}
                                                    </p>
                                                </div>
                                            )

                                        })}
                                    </div>
                                }

                                <div className={styles.postCommentContainer}>


                                </div>
                            </div>

                        </div>
                    }
                </DashboardLayout>
            </UserLayout >
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
