import { useState } from 'react'
import Style from '../../Styles/modular/AccInfo.module.css'
import { UsernameForm } from './AccInfoModifyForm';
export default function AccInfo({user}) {
    const [editUsername, setEditUsername] = useState(false);
    return (
        <>
        <h2>Account Info</h2>


        <section className={Style.main}>

            <div className={Style.card}>

                <strong>Username:</strong>
                {!editUsername && (
                <div>
                    {user.username}
                    <span style={{cursor: "pointer"}} onClick={() => setEditUsername(true)} title="Edit"> ✏️ </span>
                </div>
                )}
                {editUsername && (
                <UsernameForm setEditUsername={setEditUsername} currentUsername={user.username} />
                )}
            </div>

            <div className={Style.card}>

                <strong>Email:</strong>

                <div>

                    {user.email}<span title="Edit"> ✏️</span>

                </div>

            </div>

            <div className={Style.card}>

                <strong>Role:</strong>

                <div>

                    {user.role}

                </div>

            </div>

            <div className={Style.card}><strong>Status:</strong>{user.isVerified ? ( <p>✅ Verified</p> ) : ( <p>❌ Not Verified <br /> Please verify your email to be able to use all functionalities</p> )}</div>

        </section>
        </>
    )
}

