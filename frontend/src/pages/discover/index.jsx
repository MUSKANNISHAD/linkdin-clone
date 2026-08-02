import React, { useEffect } from 'react';
import UserLayout from '../../layout/userLayout';
import DashboardLayout from '../../layout/DashboardLayout';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUser } from '../../config/redux/action/authAction';
import styles from "./index/module/css";
import { BASE_URL } from '../../config';

export default function DiscoverPages() {

    const authState = useSelector(() => State.auth)

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
                    {
                        authState.all_profiles_fetched && authState.all_users((user) => {
                            return (
                                <div onClick={() => {
                                    router.push(`/view_profile/${user.userId.username}`)
                                }}
                                    key={user._id} className={styles.userCard}>
                                    <img className={styles.userCard_image} src={`${BASE_URL}/${user.userId.profilePicture}`} alt="profile"></img>
                                    <h1>{user.userId.name}</h1>
                                    <p>{user.userId.email}</p>
                                </div>
                            )

                        })
                    }



                </div>
            </DashboardLayout>
        </UserLayout>

    )
}
