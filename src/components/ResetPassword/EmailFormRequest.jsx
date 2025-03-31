import { useContext, useState } from "react"
import { Link } from "react-router-dom";
import { UserContext } from '../../hooks/ContextVariables';
import getFingerprint from "../../helpers/getFingerprint";
import GotoEmail from "../EmailSend";
import Style from '../../Styles/modular/utils.module.css';
export default function EmailFormRequest() {
    const { user, httpFetch } = useContext(UserContext);
    const [error, setError] = useState();
    const [ success, setSuccess ] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError(undefined);

        const email = (new FormData(e.target)).get(`email`);

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Invalid email address.");

        const req = await httpFetch('/reset/password', {
            method: "POST",
            body: JSON.stringify({
                email: email,
                fingerprint: getFingerprint(),
            })
        });

        if(req.status == 500) return setError("Internal server Error. Please report to an admin.")

        else if (req.status === 404) return setError(<>There's no user with this email: {email}. {<Link to={"/register"}>Try register.</Link>}</>)

        else if (req.status === 400) return setError(`Verification email already sent! Please check your inbox.`)

        else if (req.status == 201) return setSuccess(email);
    }

            if (success) return (<><GotoEmail email={success} /></>)
            
    return (
        <>
            <h1 className={Style["header"]}>Forgot your password?</h1>

            <div className={Style["info-header"]}>
                <p>Enter the email associated with your account. We'll send you a link to reset your password.</p>
            </div>
            <section >
                

                <form onSubmit={handleSubmit} className={Style["form-el"]}>
                    <div className={`${Style["email-input"]} ${Style.container}`}>
                        <label htmlFor="email">Email address:</label>
                        <input defaultValue={user?.email ? user.email : ""} id="email" autoComplete="email" type="text" name="email" placeholder="Email..."/>
                    </div>

                    {error && <p className={Style["error-msg"]}><b>{error}</b></p>}
                    
                        <button type="submit">Reset</button>
                </form>
            
            </section>
        </>
    )

}