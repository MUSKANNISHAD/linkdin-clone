import React, { useEffect } from 'react';
import styles from "./style.module.css";
import { useRouter } from 'next/router';
import { setIsTokenThere } from '../../config/redux/reducer/authReducer';
import { useDispatch, useSelector } from 'react-redux';

export default function DashboardLayout({ children }) {

    const router = useRouter();

    const dispatch = useDispatch()
    const authState = useSelector((state) => state.auth)

    useEffect(() => {
        if (localStorage.getItem('token') === null) {
            router.push("/login");
        }
        dispatch(setIsTokenThere());
    })
    return (
        <div>
            <div className={styles.container}>
                <div className={styles.homeContainer}>
                    <div className={styles.homeContainer_leftBar}>
                        <div onClick={() => {
                            router.push("/dashboard")
                        }}
                            className={styles.sideBarOption}>
                            <i class="fa-solid fa-house"></i>
                            Home
                        </div>
                        <div onClick={() => {
                            router.push("/discover")
                        }}
                            className={styles.sideBarOption}>
                            <i class="fa-solid fa-magnifying-glass"></i>
                            Discover
                        </div>
                        <div onClick={() => {
                            router.push("/my_connection")
                        }}
                            className={styles.sideBarOption}>
                            <i class="fa-solid fa-user"></i>
                            My Connections
                        </div>
                    </div>
                </div>
                <div className={styles.homeContainer_feedContainer}>
                    {children}
                </div>
                <div className={styles.homeContainer_extraContainer}>
                    <h1>Top Profiles</h1>
                    {authState.all_profiles_fetched && authState.all_users.map((profile) => {
                        return (
                            <div key={profile._id} className={styles.extraContainer_profile}>
                                <p>{profile.userId.name}</p>
                            </div>
                        )
                    })}
                </div>

            </div>
        </div>
    )
}
