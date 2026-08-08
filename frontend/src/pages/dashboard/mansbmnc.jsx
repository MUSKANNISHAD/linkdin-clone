import React, { useEffect, useState } from 'react';
import UserLayout from '../../layout/userLayout';
import DashboardLayout from '../../layout/DashboardLayout';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import styles from "./style.module.css";
import { getAllPosts } from '../../config/redux/action/postAction';
import { getAboutUser, getAllUser } from '../../config/redux/action/authAction';

export default function DashboardComponent() {

    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    const postState = useSelector((state) => state.postReducer);
    const router = useRouter();

    const [isTokenThere, setIsTokenThere] = useState(false);

    const [postContent, setPostContent] = useState("");
    const [fileContent, setFileContent] = useState();
    const [postComment, setPostComment] = useState("");


    useEffect(() => {
        if (localStorage.getItem("token") === null) {
            router.push("/login")
        }
        setIsTokenThere(true)
    })



    useEffect(() => {
        if (authState.isTokenThere) {
            dispatch(getAllPosts())
            dispatch(getAboutUser({
                token: localStorage.getItem('token')
            }))

            if (!authState.all_profiles_fetched) {
                dispatch(getAllUser());
            }
        }
    }, [authState.isTokenThere])




    return (
        <UserLayout>
            <DashboardLayout>
                <div className={styles.scrollContainer}>
                    {authState.profileFetched &&
                        <div> Hey,
                            {/* {console.log("authstate of user is :", authState.user.name)} */}
                            {/* {authState.user.userId.name} */}
                            {console.log("profile fetched is :", authState.profileFetched)}



                        </div>
                    }
                    <div className={styles.container}>
                        <div className={styles.home_container}>
                            <div className={styles.home_container_leftBar}>

                            </div>
                            <div className={styles.feedContainer}>

                            </div>

                            <div className={styles.extraContainer}>

                            </div>

                        </div>

                    </div>

                </div>

            </DashboardLayout>
        </UserLayout>
    )
}
