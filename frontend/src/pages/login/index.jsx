import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from "./style.module.css";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { loginUser, userSignup } from '../../config/redux/action/authAction';
import { emptyMessage } from '../../config/redux/reducer/authReducer';


export default function LoginComponent() {

    const authState = useSelector((state) => state.auth)

    const router = useRouter();

    const [isLoginMethod, setIsLoginMethod] = useState(true);

    const [name, setName] = useState("");
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");


    const dispatch = useDispatch();

    useEffect(() => {
        if (authState.loggedIn) {
            router.push("/dashboard")
        }
    }, [authState.loggedIn])

    useEffect(() => {
        if (localStorage.getItem("token")) {
            router.push("/dashboard");
        }
    }, [])

    useEffect(() => {
        dispatch(emptyMessage());
    }, [isLoginMethod]);

    const handleRegister = () => {
        console.log("registering you...")
        dispatch(userSignup({ username, password, name, email }));
    }

    const handleLogin = () => {
        console.log("loggedIn");
        dispatch(loginUser({ email, password }));
    }

    return (
       

                <div className={styles.container}>
                    <div className={styles.cardContainer}>
                        <div className={styles.cardContainer_left}>
                            <p className={styles.cardleft_heading}>{isLoginMethod ? "SignIn" : "SignUp"}</p>
                            <p style={{ color: authState.isError ? "red" : "green" }}>   {authState.message.message}</p>
                            <form className={styles.form}>
                                <TextField
                                    onChange={(e) => setEmail(e.target.value)}
                                    fullWidth
                                    label="Email"
                                    variant="outlined"
                                    margin="normal"
                                />
                                <TextField
                                    onChange={(e) => setPassword(e.target.value)}
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    variant="outlined"
                                    margin="normal"
                                />
                                {
                                    !isLoginMethod &&
                                    <>
                                        <TextField
                                            onChange={(e) => { setUserName(e.target.value) }}
                                            fullWidth
                                            label="username"
                                            type="text"
                                            variant="outlined"
                                            margin="normal"
                                        // className={styles.inputField}
                                        />
                                        <TextField
                                            onChange={(e) => setName(e.target.value)}
                                            fullWidth
                                            label="name"
                                            type="text"
                                            variant="outlined"
                                            margin="normal"
                                        />
                                    </>
                                }

                                {/* <div onClick={() => {
                                    if (isLoginMethod) {
                                        handleLogin();
                                    } else {
                                        handleRegister();
                                    }
                                }} className={styles.buttonWithOutLine}>
                                    <p>{isLoginMethod ? "Signup" : "SignIn"}</p>
                                </div> */}

                                <div onClick={() => {
                                    if (isLoginMethod) {
                                        handleLogin();
                                    } else {
                                        handleRegister();
                                    }
                                }} >
                                    <p style={{ textAlign: "center" }}>{
                                        isLoginMethod ?
                                            (<Button variant="contained">Signin</Button>)
                                            : (<Button variant="contained">SignUp</Button>)
                                    }
                                    </p>
                                </div>
                            </form>
                        </div>
                        <div className={styles.cardContainer_right}>
                            <div>
                                <h3>{isLoginMethod ? "Don't have an Account" : "Already have an Account"}</h3>
                                <div onClick={() => {
                                    setIsLoginMethod(!isLoginMethod)
                                }} style={{ color: "black", backgroundColor: "white" }}
                                    className={styles.buttonWithOutLine}>
                                    <p>{isLoginMethod ? "SignUp" : "SignIn"}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
           
    )
}
