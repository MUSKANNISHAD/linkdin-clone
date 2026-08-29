import React, { useEffect } from 'react';
import UserLayout from '../../layout/userLayout';
import DashboardLayout from '../../layout/DashboardLayout';
import styles from "./index.module.css";
import { useDispatch, useSelector } from 'react-redux';
import { acceptConnections, getMyConnectionsRequest } from '../../config/redux/action/authAction/index.js';
import { BASE_URL } from '../../config';
import { useRouter } from 'next/router';

export default function MyConnection() {

    const dispatch = useDispatch();

    const router = useRouter();

    const authState = useSelector((state) => state.auth)
    useEffect(() => {
        dispatch(getMyConnectionsRequest({ token: localStorage.getItem("token") }))

    }, [])

    useEffect(() => {
        if (authState.connectionRequest.length !== 0) {
        }
    }, [authState.connectionRequest])

    return (
        <UserLayout>
            <DashboardLayout>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.7rem" }}>
                    <h3>My Connections</h3>
                    {authState.connectionRequest.length === 0 && <h1>No Connections Yet </h1>}
                    {authState.connectionRequest.length != 0 && authState.connectionRequest.filter((connection) => connection.status === null).map((user, index) => {
                        return (
                            <div onClick={() => {
                                router.push(`/view_profile/${user.user_Id.username}`)
                            }}
                                className={styles.userCard} key={index}>
                                <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
                                    <div className={styles.profilePicture}>
                                        <img className={styles.baseImage} src={`${BASE_URL}/${user.user_Id.profilePicture}`} alt="profilePicture" />

                                    </div>
                                    <div className={styles.userInfo}>
                                        <h3>{user.user_Id?.name}</h3>
                                        <p>{user.user_Id?.username}</p>
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
                    <h3>My Network</h3>
                    {authState.connectionRequest.filter((connection) => connection.status !== null).map((user, index) => {
                        { console.log("authstate.connectionRequest is ", authState.connectionRequest) }
                        return (
                            <div onClick={() => {
                                router.push(`/view_profile/${user.user_Id?.username}`)
                            }}
                                className={styles.userCard} key={index}>
                                <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
                                    <div className={styles.profilePicture}>
                                        <img className={styles.baseImage} src={`${BASE_URL}/${user.user_Id.profilePicture}`} alt="profilePicture" />
                                    </div>
                                    <div className={styles.userInfo}>
                                        <h3>{user.user_Id?.name}</h3>
                                        <p>{user.user_Id?.username}</p>
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
