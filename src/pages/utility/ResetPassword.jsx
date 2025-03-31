import { useContext } from "react"
import Style from "../../Styles/modular/utils.module.css"
import { UserContext } from "../../hooks/ContextVariables"
import {  useState  } from 'react'
export default function ResetPassword ({email}) {

    const { user, httpFetch } = useContext(UserContext);
    const [error, setError] = useState(undefined);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(`submit`)
    }
    return (
        <>
            <h1 className={Style["header"]}>Forgot your password?</h1>

            <div className={Style["info-header"]}>
                <p>Enter the email associated with your account. We’ll send you a link to reset your password.</p>
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