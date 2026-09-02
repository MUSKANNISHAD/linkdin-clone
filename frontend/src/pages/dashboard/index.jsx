import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { createPost, getAllPosts, deletePost, incrementPostlikes, getCommentsById, postComment } from '../../config/redux/action/postAction/index.js';
import { getAboutCurrentUser, getAllUser } from '../../config/redux/action/authAction/index.js';
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

    const [postContent, setPostContent] = useState("");
    const [fileContent, setFileContent] = useState(null);
    // const [postComment, setPostComment] = useState("");
    const [commentText, setCommentText] = useState("");

    useEffect(() => {
        if (authState.isTokenThere) {
            dispatch(getAllPosts())
            dispatch(getAboutCurrentUser({ token: localStorage.getItem('token') }))

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

                                <div className={styles.createPostTop}>

                                    <img
                                        className={styles.userProfile}
                                        src={`${BASE_URL}/${authState.user.userId?.profilePicture}`}

                                        alt="Profile"
                                    />

                                    <input
                                        type="text"
                                        className={styles.postInput}
                                        placeholder="Share something with your network..."
                                        value={postContent}
                                        onChange={(e) => setPostContent(e.target.value)}
                                    />

                                </div>

                                <div className={styles.createPostBottom}>

                                    <label htmlFor="fileupload" className={styles.actionButton}>
                                        <i className="fa-regular fa-image"></i>
                                        <span>Photo</span>
                                    </label>


                                    <button
                                        className={styles.postButton}
                                        onClick={handleUpload}
                                    >
                                        Upload file
                                    </button>

                                </div>

                                <input
                                    id="fileupload"
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={(e) => setFileContent(e.target.files[0])}
                                />

                            </div>

                            <div className={styles.postsContainer}>
                                {
                                    postState.posts && postState.posts.map((post) => {
                                        return (
                                            <div key={post._id} className={styles.singleCard}>

                                                <div className={styles.singleCard_profileContainer}>
                                                    <img onClick={() => {
                                                        router.push(`/view_profile/${post.userId.username}`)
                                                    }}
                                                        className={styles.userProfile}
                                                        src={`${BASE_URL}/${post.userId?.profilePicture}`} />


                                                    <div>
                                                        <div style={{ display: "flex", gap: "1.2rem", justifyContent: "space-between", cursor: "pointer" }}>
                                                            <p onClick={() => {
                                                                router.push(`/view_profile/${post.userId.username}`)

                                                            }} style={{ fontWeight: "bold" }}>
                                                                {post.userId?.name || ""}
                                                            </p>
                                                            {
                                                                post.userId?._id === authState.user.userId?._id &&
                                                                <div onClick={async () => {
                                                                    // { console.log("delted post", deletePost) }
                                                                    await dispatch(deletePost({ post_id: post?._id }))
                                                                    await dispatch(getAllPosts())
                                                                }}
                                                                    style={{ cursor: "pointer" }}>
                                                                    {/* <i style={{ height: "1.4em", color: "red" }} className="fa-solid fa-trash">Delete</i> */}
                                                                </div>
                                                            }

                                                        </div>
                                                        <p style={{ color: "grey" }}>{post.userId?.username}</p>
                                                        <p style={{ paddingTop: "1.3rem" }}>{post.body}</p>

                                                        <div className={styles.singleCard_image}>
                                                            <img src={`${BASE_URL}/${post.media}`} />
                                                            {/* {fileContent ? console.log("uploaede image is :  ", post.media) : ""} */}
                                                        </div>

                                                        <div className={styles.optionsContainer}>
                                                            <div onClick={async () => {
                                                                await dispatch(incrementPostlikes)
                                                                dispatch(getAllPosts())
                                                            }}
                                                                className={styles.singleoptions_optionContainer}>
                                                                <i className="fa-solid fa-thumbs-up"></i>
                                                            </div>
                                                            <div onClick={() => {
                                                                dispatch(getCommentsById({ post_id: post._id }))
                                                            }}
                                                                className={styles.singleoptions_optionContainer}>
                                                                <i className="fa-solid fa-comment-dots">ch</i>
                                                                {/* {getCommentsById ? console.log("poststate is :", postState) : ""} */}

                                                            </div>
                                                            <div onClick={() => {
                                                                const text = encodeURIComponent(post.body)
                                                                const uri = encodeURIComponent("apnacollege.in");

                                                                const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                                                                window.open(twitterUrl, "_blank")
                                                            }}
                                                                className={styles.singleoptions_optionContainer}>
                                                                <i className="fa-solid fa-share-nodes"></i>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        )

                                    })
                                }
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
                                {postState.Comments.length === 0 && <h2>No comments</h2>}


                                {postState.Comments.length !== 0 &&
                                    <div>
                                        {postState.Comments.map((comment, index) => {
                                            return (
                                                <div className={styles.singleComment} key={comment._id}>

                                                    <div className={styles.singleComment_profileContainer}>
                                                        {/* <img src={`${BASE_URL}/${comment.userId.profilePicture}`} alt="profile-picture" /> */}
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
                                {console.log("postState is", postState.Comments)}
                                <div className={styles.postCommentContainer}>
                                    <input type="text" placeholder='enter Comments' value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                                    <div onClick={async () => {
                                        await dispatch(postComment({
                                            post_id: postState.postId,
                                            body: commentText
                                        }))

                                        await dispatch(getCommentsById({
                                            post_id: postState.Comments.postId
                                        }))
                                    }} className={styles.postCommentContainer_commentBtn}>
                                        <p>Comments</p>
                                    </div>


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
                    <h1>Loading...</h1>
                </DashboardLayout>
            </UserLayout>
        )
    }
}
