import { useState } from "react";
import Style from "../Styles/modular/logReg.module.css";
import getFingerprint from "../helpers/getFingerpring.js";

export default function Login() {
    const [error, setError] = useState();

    async function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const email = formData.get("email")?.trim();
        const password = formData.get("password");
        const fingerprint = getFingerprint();

        let isValid = true;

        // Reset errors
        setError(undefined);

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Invalid email address.");
            isValid = false;
        }

        if (!password || password.length < 6) {
            setError("Invalid password.");
            isValid = false;
        }


        if (isValid) {
            const apiEndpoint = `https://api.pvpscalpel.com/login`;
            const req = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "600": "BasicPass"
                },
                credentials: "include",
                body: JSON.stringify({
                    email: email,
                    password: password,
                    fingerprint: fingerprint
                })
            });

            console.log("Form is valid. Submitting...");
            console.log(req.status);
            if (req.status == 200) return e.target.reset(); 
            const data = await req.json();
            console.log(data)
            if (req.status === 409) {
                const error = (errorCase) => {return `This ${errorCase} already exists! Try another one.`};
                if (data.username) setUsernameError(error(`username`));
                if (data.email) setEmailError(error(`email`));
                return;
            } else if (req.status === 500) {
                setError(data.message);
            }
        }
    }

    return (
        <>
            <section className={Style["container"]}>
            <section className={Style["inner-section"]} style={{color: "#facc15", fontWeight:"", fontSize: "40px"}}><h4>Login</h4></section>
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className={Style["inner-section"]}>

                            <label>Email</label>
                            <input type="email" autoComplete="email" name="email" placeholder="Email.." />

                            <label>Password</label>
                            <input type="password" autoComplete="password" name="password" placeholder="Password.." />

                        <button type="submit">Login</button>
                        {error && <p className={Style["error-msg"]}><b>{error}</b></p>}
                        <p>Don't have an account? <a href="/login">Register here</a></p>
                        </div>

                    </form>

                </div>
            </section>
        </>
    );
}
