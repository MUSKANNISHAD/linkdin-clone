import { useRouter } from "next/router";
import UserLayout from "../../../layout/userLayout";
import DashboardLayout from "../../../layout/DashboardLayout";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../config";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "../../../config/redux/action/authAction";
import styles from "./index.module.css";

export default function UserProfile() {

    const router = useRouter();
    const { userId } = router.query;

    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch();

    useEffect(() => {
        if (!userId) {
            return;
        }
        dispatch(getUserById(userId));
    }, [userId, dispatch]);

    console.log("user Id is : ", userId);

    if (!user) {
        return (
            <div>
                <h1>Loading</h1>
            </div>
        )
    }

    return (
        <UserLayout>
            <DashboardLayout>
                <div>
                    User ID: {userId}
                    <br></br>
                    name is :{user.name}
                </div>
            </DashboardLayout>
        </UserLayout>
    );
}