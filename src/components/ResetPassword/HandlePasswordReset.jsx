import { useContext, useState } from "react";
import Style from "../../Styles/modular/LogReg.module.css";
import getFingerprint from "../../helpers/getFingerprint";
import { Link } from "react-router-dom";
import { UserContext } from "../../hooks/ContextVariables";

export default function HandlePasswordReset ({token}) {
    const [ error, setError ] = useState();
    const [ success, setSuccess ] = useState();

    const { httpFetch } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError(undefined);

        const formData = new FormData(e.target);

        const newPassword = formData.get(`password`);
        const rePassword = formData.get(`rePassword`);

        if (!newPassword || newPassword.length < 6) {
            return setError("Password must be at least 6 characters.");
        }

        if (newPassword !== rePassword) {
            return setError("Passwords do not match.");
        }

        try {
            const req = await httpFetch("/reset/password", {
                method: "PATCH",
                body: JSON.stringify({
                    JWT: token,
                    newPassword: newPassword,
                    fingerprint: getFingerprint(),
                }),
            });

            if (req.status == 500)
                return setError("Internal server Error. Please report to an admin.");

            if (req.status === 400)
                return setError(`Verification email already sent! Please check your inbox.`);

            if (req.status == 201) return setSuccess(true);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    }

    if (success) {
        return (
            <section className={Style.container}>
                <section className={Style["inner-section"]}>
                    <h4>Done!</h4>
                </section>
                <div className={Style["inner-section"]}>
                    <p className={Style.infoText}>
                        You can now <Link to="/login">Login</Link> with your new password!
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className={Style.container}>
            <section className={Style["inner-section"]}>
                <h4>Password Reset</h4>
            </section>
            <form onSubmit={handleSubmit}>
                <div className={Style["inner-section"]}>
                    <p>Enter a new password and submit.</p>
                    <label htmlFor="password">New Password</label>
                    <input
                        id="password"
                        autoComplete="new-password"
                        type="password"
                        name="password"
                        placeholder="New password..."
                    />
                    <label htmlFor="rePassword">Repeat Password</label>
                    <input
                        id="rePassword"
                        autoComplete="new-password"
                        type="password"
                        name="rePassword"
                        placeholder="Repeat password..."
                    />
                    {error && (
                        <p className={Style["error-msg"]}>
                            <b>{error}</b>
                        </p>
                    )}
                    <button type="submit">Reset</button>
                </div>
            </form>
        </section>
    );
    
}
