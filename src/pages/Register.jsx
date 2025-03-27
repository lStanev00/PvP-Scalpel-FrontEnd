import { useState } from "react";
import Style from "../Styles/modular/register.module.css";

export default function Register() {
    const [usernameError, setUsernameError] = useState();
    const [emailError, setEmailError] = useState();
    const [passError, setPassError] = useState();
    const [rePassError, setRePassError] = useState();
    const [checkError, setCheckError] = useState();

    async function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const username = formData.get("username")?.trim();
        const email = formData.get("email")?.trim();
        const password = formData.get("password");
        const confirmPassword = formData.get("confirm-password");
        const agreement = formData.get("agreement");

        let isValid = true;

        // Reset errors
        setUsernameError(undefined);
        setEmailError(undefined);
        setPassError(undefined);
        setRePassError(undefined);
        setCheckError(undefined);

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
            const apiEndpoint = `https://api.pvpscalpel.com/register`;
            const req = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "600": "BasicPass"
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            });

            console.log("Form is valid. Submitting...");
            console.log(req.status);
            if (req.status == 201) return e.target.reset(); 
            const data = await req.json();
            console.log(data)
            if (req.status === 409) {
                const error = (errorCase) => {return `This ${errorCase} already exists! Try another one.`};
                if (data.username) setUsernameError(error(`username`));
                if (data.email) setEmailError(error(`email`));
                return;
            }
        }
    }

    return (
        <div className={Style["register-box"]}>
            <form onSubmit={handleSubmit}>
                <label>Username</label>
                <input autoComplete="username" type="text" name="username" placeholder="Username.." />
                {usernameError && <p className={Style["error-msg"]}>{usernameError}</p>}

                <label>Email</label>
                <input type="email" autoComplete="email" name="email" placeholder="Email.." />
                {emailError && <p className={Style["error-msg"]}>{emailError}</p>}

                <label>Password</label>
                <input type="password" autoComplete="password" name="password" placeholder="Password.." />
                {passError && <p className={Style["error-msg"]}>{passError}</p>}

                <label>Confirm Password</label>
                <input type="password" name="confirm-password" autoComplete="password" placeholder="Confirm password.." />
                {rePassError && <p className={Style["error-msg"]}>{rePassError}</p>}

                <label className={Style["terms-label"]}>
                    I agree to follow the community rules. I understand that hate speech, discrimination, 
                    sexual or violent content involving minors, or any illegal activity is strictly forbidden 
                    and may result in a permanent ban and legal action.
                    <input type="checkbox" name="agreement" />
                </label>
                {checkError && <p className={Style["error-msg"]}>{checkError}</p>}

                <button type="submit">Register</button>
            </form>

            <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
    );
}
