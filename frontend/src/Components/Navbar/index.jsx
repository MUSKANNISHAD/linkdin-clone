import React, { useEffect } from 'react';
import styles from "./style.module.css";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '../../config/redux/reducer/authReducer';
// import authReducer from "../../config/redux/reducer/authReducer";
import { getAboutCurrentUser, getAllUser } from '../../config/redux/action/authAction';

export default function NavbarComponent() {

    const router = useRouter();
    const authState = useSelector((state) => state.auth)

    const dispatch = useDispatch();

    useEffect(() => {
        if (!authState.all_profiles_fetched) {
            dispatch(getAllUser());
        }
    }, [])

    useEffect(() => {
        if (authState.isTokenThere) {
            dispatch(getAboutCurrentUser({ token: localStorage.getItem('token') }))
        }
    }, [authState.isTokenThere])

    if (authState.user) {
        return (
            <>
                {/* Top Navbar */}
                <div className={styles.NavbarContainer}>
                    <div className={styles.container}>
                        <nav className={styles.navbar}>

                            <h1
                                onClick={() => {
                                    router.push("/dashboard");
                                }}
                            >
                                Pro Connect
                            </h1>

                            <div className={styles.navbarOptionContainer}>

                                {authState.profileFetched && (
                                    <div className={styles.navbarLinks}>

                                        <p className={styles.UserName}>
                                            Hey, {authState.user.userId?.name}
                                        </p>

                                        <p
                                            onClick={() => {
                                                router.push('/profile')
                                            }}
                                            style={{
                                                fontWeight: "bold",
                                                cursor: "pointer"
                                            }}
                                        >
                                            profile
                                        </p>

                                        <p
                                            onClick={() => {
                                                localStorage.removeItem("token")
                                                router.push("/login")
                                                dispatch(reset())
                                            }}
                                            style={{
                                                fontWeight: "bold",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Logout
                                        </p>

                                    </div>
                                )}

                                {!authState.profileFetched &&
                                    <div
                                        onClick={() => {
                                            router.push("/login")
                                        }}
                                        className={styles.ButtonJoin}
                                    >
                                        <p>Be a part</p>
                                    </div>
                                }

                            </div>
                        </nav>
                    </div>
                </div>


                {/* Mobile Bottom Navigation */}
                <div className={styles.mobileNav}>

                    <div
                        className={`${styles.mobileNavItem} ${router.pathname === "/dashboard"
                                ? styles.active
                                : ""
                            }`}
                        onClick={() => router.push("/dashboard")}
                    >
                        <span className={styles.mobileNavIcon}>⌂</span>
                        <span>Home</span>
                    </div>


                    <div
                        className={`${styles.mobileNavItem} ${router.pathname === "/discover"
                                ? styles.active
                                : ""
                            }`}
                        onClick={() => router.push("/discover")}
                    >
                        <span className={styles.mobileNavIcon}>⌕</span>
                        <span>Discover</span>
                    </div>


                    <div
                        className={`${styles.mobileNavItem} ${router.pathname === "/my_connection"
                                ? styles.active
                                : ""
                            }`}
                        onClick={() => router.push("/my_connection")}
                    >
                        <span className={styles.mobileNavIcon}>♙</span>
                        <span>Connections</span>
                    </div>

                </div>
            </>
        )
    } else {
        return (
            <>
                <div>Not a User</div>
            </>
        )
    }

}
