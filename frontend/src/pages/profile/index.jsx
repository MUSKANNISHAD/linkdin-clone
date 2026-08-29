import React, { useEffect, useState } from 'react';
import UserLayout from '../../layout/userLayout';
import DashboardLayout from '../../layout/DashboardLayout';
import styles from "./index.module.css";
import { useDispatch, useSelector } from 'react-redux';
import { getAboutCurrentUser } from '../../config/redux/action/authAction';
import { BASE_URL, clientServer } from '../../config';
import { getAllPosts } from '../../config/redux/action/postAction';
import { resetPostId } from '../../config/redux/reducer/postReducer';



export default function ProfilePage() {

    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth)
    const postReducer = useSelector((state) => state.postReducer)

    const [userPosts, setUserPosts] = useState([]);
    const [userProfile, setUserProfile] = useState({});
    
    const [profileChanged, setProfileChanged] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [inputData, setInputData] = useState({ company: '', position: '', years: '' });

    const handleInputData = (e) => {
        const { name, value } = e.target;
        setInputData({ ...inputData, [name]: value });
    }

    useEffect(() => {
        if (authState.user) {
            setUserProfile(authState.user);
            const posts = postReducer.posts.filter((post) => {
                return post.userId.username === authState.user.userId.username;
            });
            setUserPosts(posts);
        }
    }, [authState.user, postReducer.posts]);

    useEffect(() => {
        dispatch(getAboutCurrentUser({ token: localStorage.getItem('token') }));
        dispatch(getAllPosts());
    }, [])

    const updateProfilePicture = async (file) => {
        const formData = new FormData();
        formData.append("profile_picture", file);
        formData.append("token", localStorage.getItem("token"));

        const response = await clientServer.post("/update_profile_picture", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        dispatch(getAboutCurrentUser({ token: localStorage.getItem("token") }));
    }

    const updateProfileData = async () => {
        try {
            await clientServer.post("/update_User_Profile", {
                token: localStorage.getItem("token"),
                name: userProfile.userId.name
            });
            await clientServer.post("/update_Profile_Data", {
                token: localStorage.getItem("token"),
                bio: userProfile.bio,
                currentPost: userProfile.currentPost,
                pastWork: userProfile.pastWork,
                education: userProfile.education
            });
            // Refresh Redux user data
            await dispatch(
                getAboutCurrentUser({
                    token: localStorage.getItem("token")
                })
            );
            // Hide update button
            setProfileChanged(false);

        } catch (err) {
            console.error("Profile update failed:", err);
        }
    };


    return (
        <UserLayout>
            <DashboardLayout>
                {authState.user && userProfile.userId && (
                    <div className={styles.container}>

                        <div className={styles.profileHeader}>

                            <div className={styles.coverContainer}>

                                <img
                                    className={styles.coverImage}
                                    src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                                    alt="Cover"
                                />
                            </div>

                            <div className={styles.profilePictureWrapper}>

                                <img
                                    className={styles.profilePicture}
                                    src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                                    alt="Profile"
                                />

                                <label
                                    htmlFor="profilePictureUpload"
                                    className={styles.profilePictureOverlay}
                                >
                                    <i className="fa-solid fa-camera"></i>
                                    <span>Edit</span>
                                </label>

                                <input onChange={(e) => {
                                    updateProfilePicture(e.target.files[0]);
                                }}
                                    id="profilePictureUpload"
                                    type="file"
                                    accept="image/*"
                                    className={styles.profilePictureInput}
                                />
                            </div>
                        </div>


                        {/* Basic Information */}
                        <div className={styles.profileInfo}>

                            <div className={styles.profileContainer}>

                                <input
                                    className={styles.nameEdit}
                                    type="text"
                                    value={userProfile.userId.name}
                                    onChange={(e) => {
                                        setUserProfile({
                                            ...userProfile,
                                            userId: {
                                                ...userProfile.userId,
                                                name: e.target.value
                                            }
                                        });

                                        setProfileChanged(true);
                                    }}
                                />
                                {/* <h2>{userProfile.userId.name}</h2> */}

                                <p contentEditable className={styles.username}>
                                    {/*  see the document for more about "contentEditable" */}
                                    @{userProfile.userId.username}
                                </p>

                                <div className={styles.UserBioUpdate}>
                                    <textarea
                                        value={userProfile.bio}
                                        onChange={(e) => {
                                            setUserProfile({ ...userProfile, bio: e.target.value });
                                            setProfileChanged(true);
                                        }}
                                        style={{ width: "100%" }}
                                        rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                                    />
                                </div>



                            </div>
                            {profileChanged && (
                                <div
                                    onClick={updateProfileData}
                                    className={styles.updateProfileBtn}
                                >
                                    Update Profile
                                </div>
                            )}

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
                                <button onClick={() => {
                                    setIsModalOpen(true)
                                }} className={styles.addWorkButton}>Add work</button>

                            </div>

                        </div>



                    </div>
                )}





                {
                    isModalOpen &&
                    <div onClick={() =>
                        setIsModalOpen(false)
                    }
                        className={styles.commentsContainer}>
                        <div onClick={(e) => {
                            e.stopPropagation()
                        }} className={styles.allCommentsContainer}>

                            <input onChange={handleInputData} className={styles.inputField} name='company' type='text' placeholder='Enter your Company ' />
                            <input onChange={handleInputData} className={styles.inputField} name='position' type='text' placeholder='Enter your Position ' />
                            <input onChange={handleInputData} className={styles.inputField} type='text' placeholder='Enter your work experience ' />
                            <div onClick={() => {
                                setUserProfile({ ...userProfile, pastWork: [...userProfile.pastWork, inputData] })
                                setIsModalOpen(false)
                            }} className={styles.updateProfileBtn}>Add work</div>

                        </div>

                    </div>
                }
            </DashboardLayout>
        </UserLayout >
    )
}
