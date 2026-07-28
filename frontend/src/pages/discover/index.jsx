import React, { useEffect } from 'react';
import UserLayout from '../../layout/userLayout';
import DashboardLayout from '../../layout/DashboardLayout';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUser } from '../../config/redux/action/authAction';

export default function DiscoverPages() {

    const authState = useSelector(() => State.auth)

    const dispatch = useDispatch();

    useEffect(() => {
        if(!authState.all_profiles_fetched){
            dispatch(getAllUser());
        }

    }, [])

    return (

        <UserLayout>
            <DashboardLayout>
                <h1>Discover Pages</h1>
            </DashboardLayout>
        </UserLayout>

    )
}
