import React, { useEffect } from 'react';
import UserLayout from '../../layout/userLayout';
import DashboardLayout from '../../layout/DashboardLayout';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUser } from '../../config/redux/action/authAction';
import { getAllPosts } from '../../config/redux/action/postAction';
import styles from "./index.module.css";
import { BASE_URL } from '../../config';
// import authReducer

export default function DiscoverPages() {

    const authState = useSelector((state) => state.auth)

    const dispatch = useDispatch();

    useEffect(() => {
        if (!authState.all_profiles_fetched) { 
            dispatch(getAllUser());
        }
    }, [])

    return (

        <UserLayout>
            <DashboardLayout>
                <div className={styles.allUserProfile}>
                    <h1>Discover</h1>
                    {/* {
                        authState.all_profiles_fetched && authState.all_users((user) => {
                            return (
                                <>
                                <h1>hii</h1>
                                    <div onClick={() => {
                                        router.push(`/view_profile/${user.userId.username}`)
                                    }}
                                        key={user._id} className={styles.userCard}>
                                        <img className={styles.userCard_image} src={`${BASE_URL}/${user.userId.profilePicture}`} alt="profile"></img>
                                        <h1>{user.userId.name}</h1>
                                        <p>{user.userId.email}</p>
                                    </div>
                                </>
                            )

                        })
                    } */}
                </div>
            </DashboardLayout>
        </UserLayout>

    )
}
