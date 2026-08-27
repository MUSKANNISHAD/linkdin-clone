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
            let post = postReducer.posts.filter((post) => {
                return post.userId.username === authState.user.userId.username
            })
            setUserPosts(post)
        }
    }, [postReducer.post], [authState.user]);

    useEffect(() => {
        dispatch(getAboutUser({ token: localStorage.getItem('token') }));
        dispatch(getAllPosts());
    }, [])

    const handleProfilePicture = async () => {

    }


    return (
        <UserLayout>
            <DashboardLayout>
                {authState.user && userProfile.userId && (
                    <div className={styles.container}>

                        {/* Cover + Profile Picture */}
                        <div className={styles.profileHeader}>

                            <div className={styles.coverContainer}>
                                <img
                                    className={styles.coverImage}
                                    src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                                    alt="Cover"
                                />
                            </div>

                            <img
                                className={styles.profilePicture}
                                src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                                alt="Profile"
                            />

                        </div>


                        {/* Basic Information */}
                        <div className={styles.profileInfo}>

                            <div>
                                <h2>{userProfile.userId.name}</h2>

                                <p className={styles.username}>
                                    @{userProfile.userId.username}
                                </p>

                                <p className={styles.bio}>
                                    {userProfile.bio}
                                </p>
                            </div>

                        </div>


                        {/* Recent Activity */}
                        <div className={styles.section}>

                            <h3>Recent Activity</h3>

                            <div className={styles.activityContainer}>

                                {userPosts.map((post) => (
                                    <div
                                        key={post._id}
                                        className={styles.postCard}
                                    >
                                        {post.media !== "" && (
                                            <img
                                                src={`${BASE_URL}/${post.media}`}
                                                alt="Post"
                                            />
                                        )}
                                    </div>
                                ))}

                            </div>

                        </div>


                        {/* Work History */}
                        <div className={styles.section}>

                            <h3>Experience</h3>

                            <div className={styles.workHistoryContainer}>

                                {userProfile.pastWork.map((work, index) => (
                                    <div
                                        key={index}
                                        className={styles.workHistoryCard}
                                    >
                                        <h4>{work.position}</h4>

                                        <p>
                                            {work.company}
                                        </p>

                                        <span>
                                            {work.years} - Present
                                        </span>
                                    </div>
                                ))}

                            </div>

                        </div>

                    </div>
                )}
            </DashboardLayout>
        </UserLayout>
    )
}
