import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../hooks/ContextVariables";
import getFingerprint from "../../helpers/getFingerprint";
import GotoEmail from "../EmailSend";
import Style from "../../Styles/modular/LogReg.module.css";
export default function EmailFormRequest() {
    const { user, httpFetch } = useContext(UserContext);
    const [error, setError] = useState();
    const [ success, setSuccess ] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError(undefined);

        const email = (new FormData(e.target)).get(`email`);

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Invalid email address.");

        try {
            const req = await httpFetch("/reset/password", {
                method: "POST",
                body: JSON.stringify({
                    email: email,
                    fingerprint: getFingerprint(),
                }),
            });

            if (req.status == 500)
                return setError("Internal server Error. Please report to an admin.");

            if (req.status === 404)
                return setError(
                    <>
                        There's no user with this email: {email}.{" "}
                        <Link to={"/register"}>Try register.</Link>
                    </>
                );

            if (req.status === 400)
                return setError(`Verification email already sent! Please check your inbox.`);

            if (req.status == 201) return setSuccess(email);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    }

            if (success) return (<><GotoEmail email={success} /></>)
            
    return (
        <section className={Style.container}>
            <section className={Style["inner-section"]}>
                <h4>Forgot your password?</h4>
            </section>

            <form onSubmit={handleSubmit}>
                <div className={Style["inner-section"]}>
                    <p>
                        Enter the email associated with your account. We'll send you a link
                        to reset your password.
                    </p>
                    <label htmlFor="email">Email address</label>
                    <input
                        defaultValue={user?.email ? user.email : ""}
                        id="email"
                        autoComplete="email"
                        type="email"
                        name="email"
                        placeholder="Email..."
                    />
                    {error && (
                        <p className={Style["error-msg"]}>
                            <b>{error}</b>
                        </p>
                    )}
                    <button type="submit">Reset</button>
                    <p>
                        Need an account? <Link to="/register">Register here</Link>
                    </p>
                </div>
            </form>
        </section>
    );

}
