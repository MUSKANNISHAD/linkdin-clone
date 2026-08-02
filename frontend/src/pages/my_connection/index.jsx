import React, { useEffect } from 'react';
import UserLayout from '../../layout/userLayout';
import DashboardLayout from '../../layout/DashboardLayout';
import styles from "./index.module.css";
import { useDispatch, useSelector } from 'react-redux';
import { acceptConnections, getMyConnections } from '../../config/redux/action/authAction';
import { BASE_URL } from '../../config';
import { useRouter } from 'next/router';

export default function MyConnection() {


    const dispatch = useDispatch();

    const router = useRouter();

    const authState = useSelector((state) => state.auth)
    useEffect(() => {
        dispatch(getMyConnections({ token: localStorage.getItem("token") }))

    }, [])

    useEffect(() => {
        if (authState.connectionRequest.length !== 0) {
            console.log(authState.connectionRequest);
        }
    }, [authState.connectionRequest])

    return (
        <UserLayout>
            <DashboardLayout>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.7rem" }}>
                    <h1>My Connections</h1>
                    {authState.connectionRequest.length === 0 && <h1>No Connections Yet </h1>}
                    {authState.connectionRequest.length != 0 && authState.connectionRequest.filter((connection) => connection.status_accepted === null).map((user, index) => {
                        return (
                            <div onClick={() => {
                                router.push(`/view_profile/${user.userId.username}`)
                            }}
                                className={styles.userCard} key={index}>
                                <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
                                    <div className={styles.profilePicture}>
                                        <img src={`${BASE_URL}/{user.userId.profilePicture}`} alt="profilePicture" />
                                    </div>
                                    <div className={styles.userInfo}>
                                        <h3>{user.userId.name}</h3>
                                        <p>{user.userId.username}</p>
                                    </div>
                                    <button onClick={(e) => {
                                        e.stopPropagation()
                                        dispatch(acceptConnections({
                                            token: localStorage.getItem("token"),
                                            connectionId: user._id,
                                            action: "accept"
                                        }))
                                    }}
                                        className={styles.connectedButton}>Accept</button>
                                </div>
                            </div>
                        )
                    })}
                    <h4>My Network</h4>
                    {authState.connectionRequest.filter((connection) => connection.status_accepted !== null).map((user, index) => {
                        return (
                            <div onClick={() => {
                                router.push(`/view_profile/${user.userId.username}`)
                            }}
                                className={styles.userCard} key={index}>
                                <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
                                    <div className={styles.profilePicture}>
                                        <img src={`${BASE_URL}/{user.userId.profilePicture}`} alt="profilePicture" />
                                    </div>
                                    <div className={styles.userInfo}>
                                        <h3>{user.userId.name}</h3>
                                        <p>{user.userId.username}</p>
                                    </div>

                                </div>
                            </div>
                        )
                    })}
                </div>
            </DashboardLayout>
        </UserLayout>
    )
}
