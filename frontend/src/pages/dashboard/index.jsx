import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from '../../config/redux/action/postAction';
import { getAboutUser } from '../../config/redux/action/authAction';
import UserLayout from '../../layout/userLayout';
import NavbarComponent from '../../Components/Navbar';

export default function DashboardComponent() {


    const dispatch = useDispatch();
    const [istheretoken, setIsThereToken] = useState(false);
    const authState = useSelector((state) => state.auth)

    const router = useRouter();
    useEffect(() => {
        // if (localStorage.getItem('token') === null) {
        //     router.push("/login");
        // }
        setIsThereToken(true);
    })

    useEffect(() => {
        if (istheretoken) {
            dispatch(getAllPosts())
            dispatch(getAboutUser({ token: localStorage.getItem('token') }))

        }
    })
    return (

        <UserLayout>
            {/* <div> */}
                <NavbarComponent/>
                {/* <h1>hii</h1> */}
            {/* </div> */}
        </UserLayout>
    )
}
