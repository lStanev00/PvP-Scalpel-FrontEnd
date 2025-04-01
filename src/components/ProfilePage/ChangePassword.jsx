import { useState } from 'react'
import Style from '../../Styles/modular/LogReg.module.css'
export default function ChangePassword({setContent, httpFetch}) {
    const [error, setError] = useState();
    const [success, setSuccess] = useState();


    const onSubmit = async (e) => {
        e.preventDefault();
        setError(undefined);

        const formData = new FormData(e.target);
        const password = formData.get(`password`)
        const newPassword = formData.get(`newPassword`)
        const rePas = formData.get(`rePas`);

        if(newPassword.length < 6) return setError(`Password must be at last 6 characters`);
        if (newPassword != rePas) return setError(`Confirm Password does not match your New Password.`);

        const req = await httpFetch(`/change/password`, {
            method: "PATCH",
            body: JSON.stringify({password, newPassword}),
        });

        if (req.status == 401) return setError(`Incorect Current Password.`);
        if (req.status == 201) return setSuccess(true);
    }

    if (success) {
        return (<>
        <div className={Style.banner}>
            <h4>
                Success!
            </h4>
        </div>

            <button onClick={() => setContent(`AccInfo`)} className={Style.btn}>Go Back to profile</button>
        </>)
    }

    return (<>

        <div className={Style.banner}>
            <h4>
                Change Password
            </h4>
        </div>
        <form onSubmit={onSubmit} style={{alignContent:'center', gap:'15px'}}>

            <label htmlFor='password'>Current Password: </label>
            <input autoComplete='password' id='password' name='password' type="password" />

            <label htmlFor='newPassword'>New Password: </label>
            <input autoComplete='new-password' id='newPassword' name='newPassword' type="password" />

            <label htmlFor='rePas'>Confirm New Password: </label>
            <input id='rePas' name='rePas' type="password" autoComplete='new-password' />

            {error && (<div>
                <p style={{fontWeight:`bold`, color: "red", margin: "5px"}}>
                    {error}
                </p>
            </div>)}
            <button type='submit'>Change Password</button>


        </form>
    </>)
}