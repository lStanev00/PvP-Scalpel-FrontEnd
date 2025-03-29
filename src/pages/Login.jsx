import { useContext, useState } from "react";
import Style from "../Styles/modular/logReg.module.css";
import getFingerprint from "../helpers/getFingerprint.js";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../hooks/ContextVariables.jsx";

export default function Login() {
    const [error, setError] = useState();
    const navigate = useNavigate();
    const { httpFetch } = useContext(UserContext);

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
            const apiEndpoint = `/login`;

            const req = await httpFetch(apiEndpoint, {
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    password: password,
                    fingerprint: fingerprint
                })
            });

            if (req.status == 200) return navigate(`/`);
            if (req.status === 409) return setError(`Bad credentials! Check the input or create an account.`);
            else if (req.status === 500) return setError("Internal server error. Please report to admin.");
            else if (!req.ok) return setError("Internal server error. Please report to admin.");
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
                        <p>Don't have an account? <Link to="/register">Register here</Link></p>
                        </div>

                    </form>

                </div>
            </section>
        </>
    );
}
