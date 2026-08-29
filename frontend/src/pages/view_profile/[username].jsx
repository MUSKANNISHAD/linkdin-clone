import React, { useEffect, useState } from 'react';
import { useSearchParams } from "next/navigation";
import UserLayout from '../../layout/userLayout';
import DashboardLayout from '../../layout/DashboardLayout';
import styles from "./index.module.css";
import { BASE_URL, clientServer } from '../../config';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { sendConnectionRequest, getConnectionRequest, getMyConnectionsRequest } from '../../config/redux/action/authAction/index.js';
import { getAllPosts } from '../../config/redux/action/postAction/index.js';


// return { props: { userProfile: request.data.profile } }


export default function view_profile({ userProfile }) {

    { console.log("userProfile is ", userProfile) }

    const router = useRouter();
    const postReducer = useSelector((state) => state.postReducer);
    const authState = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const [userPost, setUserPost] = useState([]);
    const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);
    const [isConnectionNull, setIsConnetionNull] = useState(true);



    const getUserPost = async () => {
        await dispatch(getAllPosts())
        await dispatch(getConnectionRequest({ token: localStorage.getItem("token") }));
        await dispatch(getMyConnectionsRequest({ token: localStorage.getItem('token') }));
    }


    useEffect(() => {
        let post = postReducer.posts.filter((post) => {
            return post.userId.username === router.query.username
        })
        setUserPost(post)

    }, [postReducer.posts]);

    useEffect(() => {
        getUserPost();
    }, []);

    useEffect(() => {
        // console.log("authstate is ", authState.connections)
        if (authState.connections.some(user => user.user_Id?._id === userProfile.userId?._id)) {
            setIsCurrentUserInConnection(true);
            if (authState.connections.find(user => user.user_Id?._id === userProfile.userId?._id).status === true) {
                setIsConnetionNull(false);
            }
        }

        if (authState.connectionRequest.some(user => user.user_Id?._id === userProfile.userId?._id)) {
            setIsCurrentUserInConnection(true);
            if (authState.connectionRequest.find(user => user.user_Id?._id === userProfile.userId?._id).status === true) {
                setIsConnetionNull(false);
            }
        }

    }, [authState.connections, authState.connectionRequest])



    const searchParameters = useSearchParams();
    return (
        <UserLayout>
            <DashboardLayout>
                <div className={styles.container}>
                    <div className={styles.backDropContainer}>
                        <img className={styles.backDrop} src={`${BASE_URL}/${userProfile.userId?.profilePicture}`} about="backDrop" />
                    </div>


                    <div className={styles.profileContainer_details}>

                        <div style={{ display: "flex", gap: "0.7rem" }}>
                            <div style={{ flex: "0.8" }}>

                                <div style={{ display: "flex", width: "fit-content" }}>
                                    <div> <h2>{userProfile.userId?.name}</h2> </div>
                                    <p style={{ color: "grey" }}>@{userProfile?.userId?.username}</p>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
                                    {isCurrentUserInConnection ?
                                        <button className={styles.connectionButton}>
                                            {isConnectionNull ? "pending" : "Connected"}
                                        </button> :
                                        <button onClick={() => {
                                            dispatch(sendConnectionRequest({ token: localStorage.getItem("token"), user_id: userProfile.userId._id }))
                                            dispatch(getConnectionRequest({ token: localStorage.getItem("token") }))
                                        }}
                                            className={styles.connectionBtn}>Connect</button>
                                    }
                                    <div onClick={async () => {
                                        const response = await clientServer.get(`/download_Profile?id=${userProfile.userId._id}`);
                                        window.open(`${BASE_URL}/${response.data.message}`, "_blank")
                                    }}
                                        style={{ cursor: "pointer" }}>
                                        <i style={{ width: "1.2em" }} className="fa-solid fa-download"></i>
                                    </div>
                                </div>

                                <div>
                                    <p>{userProfile?.bio}</p>
                                </div>

                            </div>

                            <div style={{ flex: "0.2" }}>
                                <h3>Recent Activity</h3>

                                {postReducer.posts.map((post) => {
                                    return (
                                        <div key={post._id} className={styles.postCard}>
                                            <div className={styles.card}>
                                                <div className={styles.card_profileContainer}>
                                                    {post.media !== "" ?
                                                        <img src={`${BASE_URL}/${post.media}`} alt="base-url" />
                                                        :
                                                        <div style={{ width: "3.4rem", height: "3.4rem" }}></div>
                                                    }

                                                </div>
                                                <p>{post.body}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>


                        </div>

                    </div>


                    <div className={styles.workHistory}>
                        <div className={styles.workHistoryContainer}>
                            <h4>Work History</h4>
                            {
                                userProfile?.pastWork.map((work, index) => {
                                    return (
                                        <div key={index} className={styles.workHistoryCard}>
                                            <p style={{ display: "flex", alignItems: "center", fontWeight: "bold", gap: "0.8rem" }}>
                                                {work.company} - {work.position}
                                            </p>
                                            <p>{work.years}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>

                    </div>


                </div>
            </DashboardLayout>
        </UserLayout>
    )
}


export async function getServerSideProps(context) {
    // console.log("view profile");
    // console.log(context.query.username);

    const request = await clientServer.get('/get_User_Based_on_Username', {
        params: {
            username: context.query.username
        }
    })

    const response = await request.data;
    // console.log("response is ", response);

    return { props: { userProfile: request.data.profile } }
}
