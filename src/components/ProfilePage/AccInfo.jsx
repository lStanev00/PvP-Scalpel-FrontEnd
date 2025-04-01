export default function AccInfo({user}) {
    return (
        <>
        <h2>Account Info</h2>

        <br />

        <div>
            <strong>Username:</strong> {user.username}
            <span title="Edit"> ✏️</span>
        </div>
        <div>
            <strong>Email:</strong> {user.email}
            <span title="Edit"> ✏️</span>
        </div>

        <div>
            <strong>Role:</strong> {user.role}
        </div>

        <div>Status:{user.isVerified ? ( <strong> ✅ Verified </strong> ) : ( <strong> ❌ Not Verified </strong> )}</div>
        </>
    )
}

