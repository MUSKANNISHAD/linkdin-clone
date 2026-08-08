import React, { useEffect } from 'react';
import styles from "./style.module.css";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '../../config/redux/reducer/authReducer';
import authReducer from "../../config/redux/reducer/authReducer";
import { getAllUser } from '../../config/redux/action/authAction';

export default function NavbarComponent() {

    const router = useRouter();
    const authState = useSelector((state) => state.auth)

    const dispatch = useDispatch();

    useEffect(() => {
        if (!authState.all_profiles_fetched) {
            dispatch(getAllUser());
        }
    }, [])

    return (

        <div>
            <div className={styles.container}>
                <nav className={styles.navbar}>
                    <h1 style={{ cursor: "pointer" }} onClick={() => {
                        router.push("/");
                    }}>Pro Connect</h1>
                    <div className={styles.navbarOptionContainer}>

                        {authState.profileFetched && <div>
                            <div style={{ display: "flex", gap: "1.2rem" }}>
                                {/* <p>Hey,{authState.user.userId.name}</p> */}
                                <p onClick={() => {
                                    router.push('/profile')
                                }} style={{ fontWeight: "bold", cursor: "pointer" }}>
                                    profile
                                </p>
                                <p onClick={() => {
                                    localStorage.removeItem("token")
                                    router.push("/login")
                                    dispatch(reset());
                                }}
                                    style={{ fontWeight: "bold", cursor: "pointer" }}>Logout
                                </p>

                            </div>
                        </div>}

                        {!authState.profileFetched && <div onClick={() => {
                            console.log("authstate is :", authState.profileFetched)
                            router.push("/login")
                        }} className={styles.ButtonJoin}>
                            <p>Be a part</p>
                        </div>}

                    </div>
                </nav>
            </div>
        </div>
    )
}
