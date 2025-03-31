import { useState } from 'react';
import Style from '../../Styles/modular/utils.module.css';
import getFingerprint from '../../helpers/getFingerprint';
import { Link } from 'react-router-dom';

export default function HandlePasswordReset ({token}) {
    const [ error, setError ] = useState();
    const [ success, setSuccess ] = useState();

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

        const req = await httpFetch('/reset/password', {
            method: "Patch",
            body: JSON.stringify({
                JWT: token,
                newPassword: newPassword,
                fingerprint: getFingerprint(),
            })
        });

        if(req.status == 500) return setError("Internal server Error. Please report to an admin.")

        else if (req.status === 400) return setError(`Verification email already sent! Please check your inbox.`)

        else if (req.status == 201) return setSuccess(email);
    }

    if (success) {
        return (<>
            <h1 className={Style["header"]}>Done!</h1>

            <div className={Style["info-header"]}>
                <p>You can now <Link to="/login" >Login</Link> with your new password!</p>
            </div>
        </>)
    }

    return (
        <>
            <h1 className={Style["header"]}>Password Reset</h1>

            <div className={Style["info-header"]}>
                <p>Enter a new <b>Password</b> and submit.</p>
            </div>
            <section >
                

                <form onSubmit={handleSubmit} className={Style["form-el"]}>
                    <div className={Style.container} style={{display:'grid', gap: '15px'}}>
                    <div className={`${Style["email-input"]}`}>
                        <label htmlFor="password">New Password:</label>
                        <input id="password" autoComplete="password" type="password" name="password" placeholder="new Password..."/>
                    </div>
                    <div className={`${Style["email-input"]}`}>
                        <label htmlFor="rePassword">Reapeat Password:</label>
                        <input id="rePassword" autoComplete="password" type="password" name="rePassword" placeholder="repeat Password..."/>
                    </div>
                    </div>
                    {error && <p className={Style["error-msg"]}><b>{error}</b></p>}
                    
                        <button type="submit">Reset</button>
                </form>
            
            </section>
        </>
    )
    
}