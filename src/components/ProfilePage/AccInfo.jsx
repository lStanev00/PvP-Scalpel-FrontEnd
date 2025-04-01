export default function AccInfo({user}) {
    return (
        <>
        <h2>Account Actions</h2>
        <div><strong>Username:</strong> {user.username}</div>
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Role:</strong> {user.role}</div>
        {user.isVerified && (<div><strong>✅ Verified</strong></div>)}
        </>
    )
}