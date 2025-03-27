
export default function Register() {
    return (<>
        <div className="register-box">
            <form action="post">
                <label>Username</label>
                <input type="text" name="username" placeholder="Username.." required/>
                <label>Email</label>
                <input type="text" name="email" placeholder="Email.." required/>
                <label>Password</label>
                <input type="password" name="password" placeholder="Password.." required/>
                <label>Confirm Password</label>
                <input type="password" name="confirm-password" placeholder="Password.." required/>
            </form>
            <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
    </>)
}