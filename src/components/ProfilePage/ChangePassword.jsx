import { useState } from "react";
import Style from "../../Styles/modular/ProfileChangePW.module.css";
export default function ChangePassword({ setContent, httpFetch }) {
    const [error, setError] = useState();
    const [success, setSuccess] = useState();

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(undefined);

        const formData = new FormData(e.target);
        const password = formData.get(`password`);
        const newPassword = formData.get(`newPassword`);
        const rePas = formData.get(`rePas`);

        if (!password || !newPassword || !rePas) return setError(`Please fill all the fields`);
        if (newPassword.length < 6) return setError(`Password must be at last 6 characters`);
        if (newPassword != rePas)
            return setError(`Confirm Password does not match your New Password.`);

        const req = await httpFetch(`/change/password`, {
            method: "PATCH",
            body: JSON.stringify({ password, newPassword }),
        });

        if (req.status == 401) return setError(`Incorect Current Password.`);
        if (req.status == 201) return setSuccess(true);
    };

    if (success) {
        return (
            <>
                <div className={Style.banner}>
                    <h4>Success!</h4>
                </div>

                <button onClick={() => setContent(`AccInfo`)} className={Style.btn}>
                    Go Back to profile
                </button>
            </>
        );
    }

    return (
        <div className={Style.wrapper}>
            <div className={Style.banner}>
                <h4>Change Password</h4>
            </div>

            <form onSubmit={onSubmit}>
                <label htmlFor="password">Current Password:</label>
                <input autoComplete="password" id="password" name="password" type="password" />

                <label htmlFor="newPassword">New Password:</label>
                <input
                    autoComplete="new-password"
                    id="newPassword"
                    name="newPassword"
                    type="password"
                />

                <label htmlFor="rePas">Confirm New Password:</label>
                <input id="rePas" name="rePas" type="password" autoComplete="new-password" />

                {error && <p className={Style.error}>{error}</p>}

                <button type="submit">Change Password</button>
            </form>
        </div>
    );
}
