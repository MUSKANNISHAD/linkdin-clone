import React from 'react';
import styles from "./style.module.css";
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

export default function NavbarComponent() {

    const router = useRouter();
    const authState = useSelector((state) => state.auth)

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
                                <p>Hey,{authState.user.userId.name}</p>
                                <p style={{ fontWeight: "bold", cursor: "pointer" }}>profile</p>
                            </div>
                        </div>}

                        {!authState.profileFetched && <div onClick={() => {
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
