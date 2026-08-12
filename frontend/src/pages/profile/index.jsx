import React, { useEffect, useState } from 'react';
import UserLayout from '../../layout/userLayout';
import DashboardLayout from '../../layout/DashboardLayout';
import styles from "./index.module.css";
import { useDispatch, useSelector } from 'react-redux';
import { getAboutUser } from '../../config/redux/action/authAction';
import { BASE_URL } from '../../config';
import { getAllPosts } from '../../config/redux/action/postAction';
import { resetPostId } from '../../config/redux/reducer/postReducer';



export default function ProfilePage() {

    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth)
    const postReducer = useSelector((state) => state.postReducer)

    const [userPosts, setUserPosts] = useState([])

    const [userProfile, setUserProfile] = useState({})


    useEffect(() => {
        if (authState.user != undefined) {
            setUserProfile(authState.user)
            // let post = postReducer.post.filter((post) => {
            //     return post.userId.username === authState.user.userId.username
            // })
            // setUserPosts(post)

        }

    }, [postReducer.post], [authState.user]);

    useEffect(() => {
        dispatch(getAboutUser({ token: localStorage.getItem('token') }));
        dispatch(getAllPosts());
    }, [])

    const handleProfilePicture =async()=>{
        
    }


    return (
        <UserLayout>
            <DashboardLayout>
                {
                    authState.user && userProfile.userId &&
                    <div className={styles.container}>
                        <div className={styles.backDropContainer}>
                            <img className={styles.backDrop}
                                src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                                alt="backDrop"
                            />
                        </div>


                        <div className={styles.profileContainer_details}>

                            <div style={{ display: "flex", gap: "0.7rem" }}>
                                <div style={{ flex: "0.8" }}>

                                    <div style={{ display: "flex", width: "fit-content" }}>
                                        <h2>{userProfile.userId.name}</h2>
                                        <p style={{ color: "grey" }}>@{userProfile.userId.username}</p>
                                    </div>

                                    <div>
                                        {/* <p>{userProfile.bio}</p> */}
                                    </div>

                                </div>

                                <div style={{ flex: "0.2" }}>
                                    <h3>Recent Activity</h3>

                                    {userPosts.map((post) => {
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
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>


                            </div>

                        </div>


                        <div className={styles.workHistory}>
                            <div className={styles.workHistoryContainer}>
                                {
                                    userProfile.pastWork.map((work, index) => {
                                        return (
                                            <div key={index} className={styles.workHistoryCard}>
                                                <p style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                                                    Software Engineer at {work.company}
                                                    <br></br>
                                                    {work.position}
                                                </p>
                                                <p>from{work.years}-Present</p>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                        </div>


                    </div>
                }
            </DashboardLayout>
        </UserLayout>
    )
}
