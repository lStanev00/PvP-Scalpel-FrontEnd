import { useContext, useState } from "react";
import Style from "../../Styles/modular/AccInfo.module.css";
import { EmailForm, UsernameForm } from "./AccInfoModifyForm";
import { UserContext } from "../../hooks/ContextVariables";
import { FiEdit2 } from "react-icons/fi";

export default function AccInfo() {
    const [editUsername, setEditUsername] = useState(false);
    const [editEmail, setEditEmail] = useState(false);
    const { user } = useContext(UserContext);
    return (
        <section className={Style.main}>
            <h3 className={Style.headerTitle}>Account Info</h3>
            <div className={Style.card}>
                <strong>Username:</strong>
                {!editUsername ? (
                    <div>
                        {user.username}
                        <span
                            onClick={() => setEditUsername(true)}
                            title="Edit"
                            className={Style.editIcon}>
                            <FiEdit2 />
                        </span>
                    </div>
                ) : (
                    <UsernameForm
                        setEditUsername={setEditUsername}
                        currentUsername={user.username}
                    />
                )}
            </div>

            <div className={Style.card}>
                <strong>Email:</strong>
                {!editEmail ? (
                    <div>
                        {user.email}
                        <span
                            onClick={() => setEditEmail(true)}
                            title="Edit"
                            className={Style.editIcon}>
                            <FiEdit2 />
                        </span>
                    </div>
                ) : (
                    <EmailForm setEditEmail={setEditEmail} email={user.email} />
                )}
            </div>

            <div className={Style.card}>
                <strong>Role:</strong>
                <div>{user.role}</div>
            </div>

            <div className={Style.card}>
                <strong>Status:</strong>
                {user.isVerified ? (
                    <p className={Style.verified}>Verified</p>
                ) : (
                    <p className={Style.notVerified}>Not Verified</p>
                )}
            </div>
        </section>
    );
}
