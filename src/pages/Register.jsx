import { useState } from "react";
import Style from "../Styles/modular/logReg.module.css";
import getFingerprint from "../helpers/getFingerprint.js";
import { Link, useNavigate } from "react-router-dom";
import httpFetch from "../helpers/httpFetch.js";

export default function Register() {
    const [usernameError, setUsernameError] = useState();
    const [emailError, setEmailError] = useState();
    const [passError, setPassError] = useState();
    const [rePassError, setRePassError] = useState();
    const [checkError, setCheckError] = useState();
    const [serverError, setServerError] = useState();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const username = formData.get("username")?.trim();
        const email = formData.get("email")?.trim();
        const password = formData.get("password");
        const confirmPassword = formData.get("confirm-password");
        const agreement = formData.get("agreement");
        const fingerprint = getFingerprint();

        let isValid = true;

        // Reset errors
        setUsernameError(undefined);
        setEmailError(undefined);
        setPassError(undefined);
        setRePassError(undefined);
        setCheckError(undefined);
        setServerError(undefined);

        if (!username || username.length < 3) {
            setUsernameError("Username must be at least 3 characters long.");
            isValid = false;
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError("Invalid email address.");
            isValid = false;
        }

        if (!password || password.length < 6) {
            setPassError("Password must be at least 6 characters.");
            isValid = false;
        }

        if (password !== confirmPassword) {
            setRePassError("Passwords do not match.");
            isValid = false;
        }

        if (!agreement) {
            setCheckError("You must agree to the community rules.");
            isValid = false;
        }

        if (isValid) {
            const apiEndpoint = `/register`;
            const req = await httpFetch(apiEndpoint, {
                method: 'POST',
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                    fingerprint: fingerprint,
                })
            });

            console.log("Form is valid. Submitting...");
            console.log(req.status);
            if (req.status == 201) {
                
                e.target.reset();

                navigate("/goto/email")
            } 
            const data = await req.json();
            console.log(data)
            if (req.status === 409) {
                const error = (errorCase) => {return `This ${errorCase} already exists! Try another one.`};
                if (data.username) setUsernameError(error(`username`));
                if (data.email) setEmailError(error(`email`));
                return;
            } else if (req.status === 500) {
                setServerError(data.message);
            }
        }
    }

    return (
        <>
            <section className={Style["container"]}>
            <section className={Style["inner-section"]} style={{color: "#facc15", fontWeight:"", fontSize: "40px"}}><h4>New account</h4></section>
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className={Style["inner-section"]}>
                            <label htmlFor="username">Username</label>
                            <input id="username" autoComplete="username" type="text" name="username" placeholder="Username.." />
                            {usernameError && <p className={Style["error-msg"]}>{usernameError}</p>}

                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" autoComplete="email" name="email" placeholder="Email.." />
                            {emailError && <p className={Style["error-msg"]}>{emailError}</p>}

                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" autoComplete="password" name="password" placeholder="Password.." />
                            {passError && <p className={Style["error-msg"]}>{passError}</p>}

                            <label htmlFor="repas">Confirm Password</label>
                            <input type="password" id="repas" name="confirm-password" autoComplete="password" placeholder="Confirm password.." />
                            {rePassError && <p className={Style["error-msg"]}>{rePassError}</p>}

                        </div>
                        <div  className={Style["inner-section"]}>
                        <label>
                            <span >
                                I agree to follow the community rules. I understand that hate speech, discrimination, 
                                sexual or violent content involving minors, or any illegal activity is strictly forbidden 
                                and may result in a permanent ban and legal action.
                            </span>
                        </label>
                            <div style={{display:"flex", alignItems:"center"}}>
                                <p onClick={
                                    (e)=> {
                                        const box = e.target.parentNode.querySelector(`#agreement`);
                                        box.checked = box.checked ? false : true;
                                    }
                                }

                                    style={{margin:"10px"}}>
                                    Terms agreement:
                                </p> 
                                <input id="agreement" style={{bottom:"3px"}} className={Style.checkbox} type="checkbox" name="agreement" />
                            </div>
                            {checkError && <p className={Style["error-msg"]}>{checkError}</p>}

                        </div>

                        <button type="submit">Register</button>
                        {serverError && <p className={Style["error-msg"]}><b>{serverError}</b></p>}
                        <p style={{marginTop: "10px"}}>Already have an account? <Link to="/login">Login here</Link></p>
                    </form>

                </div>
            </section>
        </>
    );
}
